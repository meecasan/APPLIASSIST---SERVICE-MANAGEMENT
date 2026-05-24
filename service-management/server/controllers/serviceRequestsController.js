/**
 * FIX #2: Service Requests Controller
 * Location: server/controllers/serviceRequestsController.js (NEW FILE)
 * 
 * Handles all service request (booking) operations
 */

const db = require('../config/db');
const { getIO } = require('../realtime');

/**
 * Create a new service request (booking)
 * POST /api/service-requests
 */
exports.createServiceRequest = (req, res) => {
  const {
    customer_id,
    technician_id,
    appliance_type,
    issue_description,
    appointment_date,
    service_address,
    contact_name,
    contact_number,
    additional_instructions,
  } = req.body;

  // Validate required fields
  if (!customer_id || !appointment_date || !service_address || !issue_description) {
    return res.status(400).json({
      error: 'Missing required fields: customer_id, appointment_date, service_address, issue_description',
    });
  }

  const sql = `
    INSERT INTO service_requests (
      customer_id,
      technician_id,
      appointment_date,
      service_address,
      issue_description,
      status
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      customer_id,
      technician_id || null,
      appointment_date,
      service_address,
      issue_description,
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
          preferred_date: appointment_date,
          timestamp: new Date(),
        });
      } catch (e) {
        // Real-time error - not critical
        console.log('Real-time notification failed:', e.message);
      }

      res.status(201).json({
        message: 'Service request created successfully',
        service_request_id: newServiceRequestId,
        status: 'Pending',
      });
    }
  );
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
      sr.service_request_id,
      sr.customer_id,
      sr.technician_id,
      sr.appointment_date,
      sr.service_address,
      sr.issue_description,
      sr.status,
      sr.created_at,
      t.first_name as technician_first_name,
      t.last_name as technician_last_name,
      t.contact_number as technician_phone
    FROM service_requests sr
    LEFT JOIN technicians t ON sr.technician_id = t.technician_id
    WHERE sr.customer_id = ?
    ORDER BY sr.created_at DESC
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
      sr.service_request_id,
      sr.customer_id,
      sr.technician_id,
      sr.appointment_date,
      sr.service_address,
      sr.issue_description,
      sr.status,
      sr.created_at,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      c.contact_number as customer_phone,
      c.email as customer_email
    FROM service_requests sr
    LEFT JOIN customers c ON sr.customer_id = c.customer_id
    WHERE sr.technician_id = ?
    ORDER BY sr.appointment_date ASC
  `;

  db.query(sql, [technician_id], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve service requests' });
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
      sr.service_request_id,
      sr.customer_id,
      sr.technician_id,
      sr.appointment_date,
      sr.service_address,
      sr.issue_description,
      sr.status,
      sr.created_at,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      c.email as customer_email,
      t.first_name as technician_first_name,
      t.last_name as technician_last_name
    FROM service_requests sr
    LEFT JOIN customers c ON sr.customer_id = c.customer_id
    LEFT JOIN technicians t ON sr.technician_id = t.technician_id
    WHERE sr.service_request_id = ?
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

  const validStatuses = ['Pending', 'Assigned', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const sql = `
    UPDATE service_requests 
    SET status = ?, technician_id = ?
    WHERE service_request_id = ?
  `;

  db.query(sql, [status, technician_id || null, id], (err) => {
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
