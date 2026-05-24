const db = require('../config/db');
const { getIO } = require('../realtime');

// Assign a technician to a service request
exports.assignTechnician = (req, res) => {
    const { technician_id, service_request_id } = req.body;

    const sql = `UPDATE service_requests SET technician_id = ?, status = 'Assigned' WHERE service_request_id = ?`;
    db.query(sql, [technician_id, service_request_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Service request not found' });
        getIO()?.rt.serviceAssigned({
          service_request_id,
          technician_id,
          customer_id: null,
          store_id: null,
        });
        res.status(200).json({ message: 'Technician assigned successfully' });
    });
};

// Get all service requests assigned to a technician
exports.getTechnicianRequests = (req, res) => {
    const technician_id = req.user.id; // Assuming technician ID is available in req.user

    const sql = `SELECT * FROM service_requests WHERE technician_id = ?`;
    db.query(sql, [technician_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// Update service request status
exports.updateRequestStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = `UPDATE service_requests SET status = ? WHERE service_request_id = ?`;
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Service request not found' });
        getIO()?.rt.serviceUpdated({ service_request_id: id, status });
        res.status(200).json({ message: 'Service request status updated successfully' });
    });
};