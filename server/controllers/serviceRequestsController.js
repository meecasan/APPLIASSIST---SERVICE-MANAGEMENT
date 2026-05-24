/**
 * FIX #2: Service Requests Controller
 * Location: server/controllers/serviceRequestsController.js
 * 
 * Handles all service request (booking) operations matching the actual MySQL schema.
 */

const db = require('../config/db');
const { getIO } = require('../realtime');

/**
 * Create a new service request (booking)
 * POST /api/service-requests
 */
exports.createServiceRequest = (req, res) => {
  console.log('[ServiceRequest] POST /api/service-requests body:', JSON.stringify(req.body));

  // Accept DB-schema field names directly from frontend
  const {
    customer_id,
    technician_id,
    appliance_type,
    problem_description,
    service_address,   // DB column name
    scheduled_date,    // DB column name (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
  } = req.body;

  // Ensure scheduled_date is a valid MySQL DATETIME string
  let resolvedScheduledDate = null;
  if (scheduled_date) {
    // If just a date (YYYY-MM-DD), append midnight time
    resolvedScheduledDate = scheduled_date.includes('T')
      ? scheduled_date.replace('T', ' ').substring(0, 19)
      : (scheduled_date.length === 10 ? `${scheduled_date} 00:00:00` : scheduled_date);
  }

  // Validate required fields (matching actual DB columns)
  const missingFields = [];
  if (!customer_id)           missingFields.push('customer_id');
  if (!technician_id)         missingFields.push('technician_id');
  if (!scheduled_date)        missingFields.push('scheduled_date');
  if (!service_address)       missingFields.push('service_address');
  if (!problem_description)   missingFields.push('problem_description');

  if (missingFields.length > 0) {
    console.warn('[ServiceRequest] Missing fields:', missingFields);
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`,
      missing: missingFields,
    });
  }

  // Step 1: Auto-create an appliance record to satisfy the appliance_id FK
  const applianceName = appliance_type || 'General Appliance';
  const applianceCategory = appliance_type || 'General';
  const applianceSql = `INSERT INTO appliances (customer_id, appliance_name, category) VALUES (?, ?, ?)`;

  db.query(applianceSql, [customer_id, applianceName, applianceCategory], (err, result) => {
    if (err) {
      console.error('Appliance creation error:', err);
      return res.status(500).json({ error: 'Failed to create appliance record', details: err.message });
    }

    const appliance_id = result.insertId;

    // Step 2: Insert into service_requests using exact DB column names
    const sql = `
      INSERT INTO service_requests (
        customer_id,
        technician_id,
        appliance_id,
        scheduled_date,
        service_address,
        problem_description,
        service_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        customer_id,
        technician_id || null,
        appliance_id,
        resolvedScheduledDate,
        service_address,
        problem_description,
        'Pending',
      ],
      (err, result) => {
        if (err) {
          console.error('Service request creation error:', err);
          return res.status(500).json({
            error: 'Failed to create service request',
            details: err.message,
          });
        }

        const newServiceRequestId = result.insertId;

        // Emit real-time notification
        try {
          getIO()?.rt.serviceNew({
            service_request_id: newServiceRequestId,
            customer_id,
            status: 'Pending',
            preferred_date: resolvedScheduledDate,
            timestamp: new Date(),
          });
        } catch (e) {
          console.log('Real-time notification failed:', e.message);
        }

        res.status(201).json({
          message: 'Service request created successfully',
          request_id: newServiceRequestId,
          reference: `REQ-${String(newServiceRequestId).padStart(6, '0')}`,
          status: 'Pending',
        });
      }
    );
  });
};

/**
 * List service requests (with query filters)
 * GET /api/service-requests?technician_id=1&customer_id=2&status=Pending
 */
exports.listServiceRequests = (req, res) => {
  const { technician_id, customer_id, status } = req.query;

  let sql = `
    SELECT 
      sr.request_id as service_request_id,
      sr.customer_id,
      sr.technician_id,
      sr.scheduled_date as appointment_date,
      sr.service_address,
      sr.problem_description as issue_description,
      sr.service_status as status,
      sr.request_date as created_at,
      a.appliance_name as appliance_type,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      c.contact_number as customer_phone,
      c.email as customer_email,
      t.first_name as technician_first_name,
      t.last_name as technician_last_name
    FROM service_requests sr
    LEFT JOIN customers c ON sr.customer_id = c.customer_id
    LEFT JOIN appliances a ON sr.appliance_id = a.appliance_id
    LEFT JOIN technicians t ON sr.technician_id = t.technician_id
    WHERE 1=1
  `;
  const params = [];

  if (technician_id) {
    sql += ` AND sr.technician_id = ?`;
    params.push(technician_id);
  }
  if (customer_id) {
    sql += ` AND sr.customer_id = ?`;
    params.push(customer_id);
  }
  if (status) {
    sql += ` AND sr.service_status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY sr.scheduled_date ASC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve service requests', details: err.message });
    }

    res.json(results || []);
  });
};

/**
 * Get service requests for a specific customer

 * GET /api/service-requests/customer/:customer_id
 */
exports.getCustomerServiceRequests = (req, res) => {
  const { customer_id } = req.params;

  if (!customer_id) {
    return res.status(400).json({ error: 'customer_id required' });
  }

  const sql = `
    SELECT 
      sr.request_id,
      sr.customer_id,
      sr.technician_id,
      sr.scheduled_date as appointment_date,
      sr.service_address,
      sr.problem_description as issue_description,
      sr.service_status as status,
      sr.request_date as created_at,
      t.first_name as technician_first_name,
      t.last_name as technician_last_name,
      t.contact_number as technician_phone
    FROM service_requests sr
    LEFT JOIN technicians t ON sr.technician_id = t.technician_id
    WHERE sr.customer_id = ?
    ORDER BY sr.request_date DESC
  `;

  db.query(sql, [customer_id], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve service requests' });
    }

    res.json(results || []);
  });
};

/**
 * Get service requests assigned to a technician
 * GET /api/service-requests/technician/:technician_id
 */
exports.getTechnicianServiceRequests = (req, res) => {
  const { technician_id } = req.params;

  if (!technician_id) {
    return res.status(400).json({ error: 'technician_id required' });
  }

  const sql = `
    SELECT 
      sr.request_id as service_request_id,
      sr.customer_id,
      sr.technician_id,
      sr.scheduled_date as appointment_date,
      sr.service_address,
      sr.problem_description as issue_description,
      sr.service_status as status,
      sr.request_date as created_at,
      a.appliance_name as appliance_type,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      c.contact_number as customer_phone,
      c.email as customer_email
    FROM service_requests sr
    LEFT JOIN customers c ON sr.customer_id = c.customer_id
    LEFT JOIN appliances a ON sr.appliance_id = a.appliance_id
    WHERE sr.technician_id = ?
    ORDER BY sr.scheduled_date ASC
  `;

  db.query(sql, [technician_id], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve service requests', details: err.message });
    }

    res.json(results || []);
  });
};

/**
 * Get a single service request
 * GET /api/service-requests/:id
 */
exports.getServiceRequest = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Service request ID required' });
  }

  const sql = `
    SELECT 
      sr.request_id,
      sr.customer_id,
      sr.technician_id,
      sr.scheduled_date as appointment_date,
      sr.service_address,
      sr.problem_description as issue_description,
      sr.service_status as status,
      sr.request_date as created_at,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      c.email as customer_email,
      t.first_name as technician_first_name,
      t.last_name as technician_last_name
    FROM service_requests sr
    LEFT JOIN customers c ON sr.customer_id = c.customer_id
    LEFT JOIN technicians t ON sr.technician_id = t.technician_id
    WHERE sr.request_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve service request' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    res.json(results[0]);
  });
};

/**
 * Update service request status
 * PUT /api/service-requests/:id/status
 * Body: { status: 'Pending|Assigned|Completed|Cancelled', technician_id?: number }
 */
exports.updateServiceRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status, technician_id } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Service request ID and status required' });
  }

  const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  let sql = `
    UPDATE service_requests 
    SET service_status = ?
  `;
  const params = [status];

  if (technician_id !== undefined) {
    sql += `, technician_id = ?`;
    params.push(technician_id || null);
  }

  sql += ` WHERE request_id = ?`;
  params.push(id);

  db.query(sql, params, (err) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({ error: 'Failed to update service request' });
    }

    // Emit real-time notification
    try {
      getIO()?.emit('serviceRequestUpdated', {
        service_request_id: id,
        status,
        technician_id,
        timestamp: new Date(),
      });
    } catch (e) {
      console.log('Real-time notification failed:', e.message);
    }

    res.json({ message: 'Service request updated successfully', status });
  });
};
