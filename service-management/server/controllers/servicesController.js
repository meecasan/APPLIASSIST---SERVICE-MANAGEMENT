const db = require('../config/db');
const { getIO } = require('../realtime');

const resolveServiceRequestKey = async () => new Promise((resolve, reject) => {
  db.query('SHOW COLUMNS FROM service_requests', (err, cols) => {
    if (err) return reject(err);
    const fields = cols.map(c => c.Field);
    const pk = fields.includes('service_request_id') ? 'service_request_id' : 'id';
    resolve({ fields, pk });
  });
});

// Helper function to get technician ID from email
const getTechnicianIdByEmail = (email, callback) => {
  const sql = 'SELECT technician_id FROM technicians WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err || !results.length) {
      return callback(null);
    }
    callback(results[0].technician_id);
  });
};

// Helper function to check if technician is assigned to a service request
const checkTechnicianAssignment = (serviceRequestId, technicianId, callback) => {
  resolveServiceRequestKey().then(({ pk }) => {
    const sql = `SELECT technician_id FROM service_requests WHERE ${pk} = ?`;
    db.query(sql, [serviceRequestId], (err, results) => {
      if (err || !results.length) {
        return callback(false);
      }
      callback(results[0].technician_id === technicianId);
    });
  }).catch(() => callback(false));
};

exports.createServiceRequest = async (req, res) => {
  const body = req.body || {};
  const userId = (req.user && req.user.id) || body.customer_id || body.customerId;
  if (!userId) return res.status(400).json({ message: 'Missing customer identification' });

  try {
    const { fields } = await resolveServiceRequestKey();
    const insertFields = [];
    const placeholders = [];
    const values = [];

    if (fields.includes('customer_id')) { insertFields.push('customer_id'); placeholders.push('?'); values.push(userId); }
    else if (fields.includes('requester_id')) { insertFields.push('requester_id'); placeholders.push('?'); values.push(userId); }

    if (fields.includes('technician_id') && body.technician_id) { insertFields.push('technician_id'); placeholders.push('?'); values.push(body.technician_id); }
    if (fields.includes('store_id') && body.store_id) { insertFields.push('store_id'); placeholders.push('?'); values.push(body.store_id); }
    if (fields.includes('service_id') && body.service_id) { insertFields.push('service_id'); placeholders.push('?'); values.push(body.service_id); }
    if (fields.includes('appliance_id')) { insertFields.push('appliance_id'); placeholders.push('?'); values.push(body.appliance_id || body.applianceId || null); }
    if (fields.includes('service_address')) { insertFields.push('service_address'); placeholders.push('?'); values.push(body.service_address || body.address || null); }
    if (fields.includes('issue_description')) { insertFields.push('issue_description'); placeholders.push('?'); values.push(body.issue_description || body.description || null); }
    if (fields.includes('status')) { insertFields.push('status'); placeholders.push('?'); values.push(body.status || 'Pending'); }
    if (fields.includes('appointment_date')) { insertFields.push('appointment_date'); placeholders.push('?'); values.push(body.appointment_date || body.scheduled_at || null); }
    if (fields.includes('scheduled_at') && !fields.includes('appointment_date')) { insertFields.push('scheduled_at'); placeholders.push('?'); values.push(body.scheduled_at || null); }

    if (insertFields.length === 0) return res.status(400).json({ message: 'No compatible columns found for service_requests' });

    const sql = `INSERT INTO service_requests (${insertFields.join(',')}) VALUES (${placeholders.join(',')})`;
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      
      // Emit real-time event
      getIO()?.rt.serviceNew({ 
        service_request_id: result.insertId, 
        customer_id: userId, 
        store_id: body.store_id, 
        issue_description: body.issue_description || body.description, 
        appointment_date: body.appointment_date || body.scheduled_at, 
        status: 'Pending' 
      });
      
      res.json({ service_request_id: result.insertId, message: 'Service request created' });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getService = async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  
  try {
    const { pk } = await resolveServiceRequestKey();
    
    const sql = `
      SELECT sr.*, 
             c.first_name as customer_first_name, c.last_name as customer_last_name, c.contact_number, c.address as customer_address,
             t.first_name as technician_first_name, t.last_name as technician_last_name, t.contact_number as technician_contact,
             s.store_name
      FROM service_requests sr
      LEFT JOIN customers c ON sr.customer_id = c.customer_id
      LEFT JOIN technicians t ON sr.technician_id = t.technician_id
      LEFT JOIN stores s ON sr.store_id = s.store_id
      WHERE sr.${pk} = ?
    `;
    
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ message: 'Service request not found' });
      
      const serviceRequest = results[0];
      
      // For technicians, verify they are assigned to this request
      if (currentUser && currentUser.role === 'technician') {
        getTechnicianIdByEmail(currentUser.email, (technicianId) => {
          if (!technicianId) {
            return res.status(404).json({ message: 'Technician account not found' });
          }
          
          if (serviceRequest.technician_id !== technicianId && currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to view this service request' });
          }
          res.json(serviceRequest);
        });
      } else {
        res.json(serviceRequest);
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listServices = async (req, res) => {
  const { customer_id, technician_id, store_id, status, my_requests } = req.query;
  const currentUser = req.user;
  
  try {
    const { pk, fields } = await resolveServiceRequestKey();
    let sql = 'SELECT sr.*, c.first_name as customer_first_name, c.last_name as customer_last_name, c.contact_number, c.address as customer_address, t.first_name as technician_first_name, t.last_name as technician_last_name';
    sql += ' FROM service_requests sr';
    sql += ' LEFT JOIN customers c ON sr.customer_id = c.customer_id';
    sql += ' LEFT JOIN technicians t ON sr.technician_id = t.technician_id';
    sql += ' WHERE 1=1';
    const params = [];
    
    // If my_requests flag is set and user is a technician, filter by their technician_id
    if (my_requests === 'true' && currentUser && currentUser.role === 'technician') {
      getTechnicianIdByEmail(currentUser.email, (technicianId) => {
        if (!technicianId) {
          return res.status(404).json({ message: 'Technician account not found' });
        }
        sql += ' AND sr.technician_id = ?';
        params.push(technicianId);
        
        // Add other filters
        if (status && fields.includes('status')) { sql += ' AND sr.status = ?'; params.push(status); }
        if (store_id && fields.includes('store_id')) { sql += ' AND sr.store_id = ?'; params.push(store_id); }
        
        sql += ' ORDER BY sr.appointment_date DESC';
        
        db.query(sql, params, (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(results);
        });
      });
      return;
    }
    
    // Apply filters based on query parameters
    if (customer_id && fields.includes('customer_id')) { sql += ' AND sr.customer_id = ?'; params.push(customer_id); }
    if (technician_id && fields.includes('technician_id')) { sql += ' AND sr.technician_id = ?'; params.push(technician_id); }
    if (store_id && fields.includes('store_id')) { sql += ' AND sr.store_id = ?'; params.push(store_id); }
    if (status && fields.includes('status')) { sql += ' AND sr.status = ?'; params.push(status); }
    
    sql += ' ORDER BY sr.appointment_date DESC';
    
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignTechnician = async (req, res) => {
  const { id } = req.params;
  const { technician_id } = req.body;
  if (!technician_id) return res.status(400).json({ message: 'Missing technician_id' });
  try {
    const { pk, fields } = await resolveServiceRequestKey();
    const setClauses = ['technician_id = ?', 'status = ?'];
    const params = [technician_id, 'Assigned', id];
    const sql = `UPDATE service_requests SET ${setClauses.join(', ')} WHERE ${pk} = ?`;
    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ error: err });
      
      // Fetch service details for emit
      db.query(`SELECT customer_id, store_id FROM service_requests WHERE ${pk} = ?`, [id], (qErr, rows) => {
        if (!qErr && rows.length) {
          getIO()?.rt.serviceAssigned({ 
            service_request_id: id, 
            customer_id: rows[0].customer_id, 
            technician_id, 
            store_id: rows[0].store_id 
          });
        }
        res.json({ message: 'Technician assigned' });
      });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const currentUser = req.user;
  
  if (!status) return res.status(400).json({ message: 'Missing status' });
  
  try {
    const { pk, fields } = await resolveServiceRequestKey();
    
    // For technicians, verify they are assigned to this service request
    if (currentUser.role === 'technician') {
      getTechnicianIdByEmail(currentUser.email, (technicianId) => {
        if (!technicianId) {
          return res.status(403).json({ message: 'Technician account not found' });
        }
        
        checkTechnicianAssignment(parseInt(id), technicianId, (isAssigned) => {
          if (!isAssigned) {
            return res.status(403).json({ message: 'You are not assigned to this service request' });
          }
          
          // Technician can only update to specific statuses
          const allowedStatuses = ['In Progress', 'Completed', 'Cancelled'];
          if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Technicians can only update status to: ${allowedStatuses.join(', ')}` });
          }
          
          const sql = `UPDATE service_requests SET status = ? WHERE ${pk} = ?`;
          db.query(sql, [status, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Fetch service details for emit
            db.query(`SELECT customer_id, technician_id, store_id FROM service_requests WHERE ${pk} = ?`, [id], (qErr, rows) => {
              if (!qErr && rows.length) {
                getIO()?.rt.serviceUpdated({ 
                  service_request_id: id, 
                  customer_id: rows[0].customer_id, 
                  technician_id: rows[0].technician_id, 
                  store_id: rows[0].store_id, 
                  status 
                });
              }
              res.json({ message: 'Status updated successfully' });
            });
          });
        });
      });
    } else {
      // Admin or store_owner can update without restriction
      const sql = `UPDATE service_requests SET status = ? WHERE ${pk} = ?`;
      db.query(sql, [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Fetch service details for emit
        db.query(`SELECT customer_id, technician_id, store_id FROM service_requests WHERE ${pk} = ?`, [id], (qErr, rows) => {
          if (!qErr && rows.length) {
            getIO()?.rt.serviceUpdated({ 
              service_request_id: id, 
              customer_id: rows[0].customer_id, 
              technician_id: rows[0].technician_id, 
              store_id: rows[0].store_id, 
              status 
            });
          }
          res.json({ message: 'Status updated successfully' });
        });
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const { pk } = await resolveServiceRequestKey();
    db.query(`DELETE FROM service_requests WHERE ${pk} = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Service deleted' });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Get service requests for a specific store (for store owners)
exports.getStoreServiceRequests = async (req, res) => {
  const { store_id } = req.params;
  const { status } = req.query;
  const currentUser = req.user;
  
  try {
    const { pk } = await resolveServiceRequestKey();
    
    // Verify store ownership if user is a store_owner
    if (currentUser.role === 'store_owner') {
      const checkSql = 'SELECT store_owner_id FROM stores WHERE store_id = ?';
      db.query(checkSql, [store_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ message: 'Store not found' });
        
        // Get store_owner_id from store_owners table
        const userSql = 'SELECT store_owner_id FROM store_owners WHERE email = ?';
        db.query(userSql, [currentUser.email], (err, userResults) => {
          if (err) return res.status(500).json({ error: err.message });
          if (!userResults.length || userResults[0].store_owner_id !== results[0].store_owner_id) {
            return res.status(403).json({ message: 'You do not have permission to view this store\'s service requests' });
          }
          
          // Fetch service requests for this store
          fetchStoreRequests(store_id, status, pk, res);
        });
      });
    } else {
      // Admin can view any store's requests
      fetchStoreRequests(store_id, status, pk, res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to fetch store service requests
function fetchStoreRequests(store_id, status, pk, res) {
  let sql = `
    SELECT sr.*, 
           c.first_name as customer_first_name, c.last_name as customer_last_name, c.contact_number,
           t.first_name as technician_first_name, t.last_name as technician_last_name
    FROM service_requests sr
    LEFT JOIN customers c ON sr.customer_id = c.customer_id
    LEFT JOIN technicians t ON sr.technician_id = t.technician_id
    WHERE sr.store_id = ?
  `;
  const params = [store_id];
  
  if (status) {
    sql += ' AND sr.status = ?';
    params.push(status);
  }
  
  sql += ' ORDER BY sr.appointment_date DESC';
  
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
}