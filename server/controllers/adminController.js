const db = require('../config/db');
const { getIO } = require('../realtime');

// Get all pending technicians
exports.getPendingTechnicians = (req, res) => {
  const sql = `SELECT technician_id, first_name, middle_name, last_name, email, contact_number, specialization, service_area, account_status FROM technicians WHERE account_status = 'Pending'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
};



// Get all rejected technicians
exports.getRejectedTechnicians = (req, res) => {
  const sql = `SELECT technician_id, first_name, middle_name, last_name, email, contact_number, specialization, service_area, account_status FROM technicians WHERE account_status = 'Rejected'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
};



// Approve technician
exports.approveTechnician = (req, res) => {
  const { technician_id } = req.params;
  const sql = `UPDATE technicians SET account_status = 'Approved' WHERE technician_id = ?`;
  db.query(sql, [technician_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Technician not found' });
    
    // Emit real-time event
    getIO()?.rt.userApproved({ user_id: technician_id, role: 'technician' });
    
    res.json({ message: 'Technician approved successfully' });
  });
};



// Reject technician
exports.rejectTechnician = (req, res) => {
  const { technician_id } = req.params;
  const sql = `UPDATE technicians SET account_status = 'Rejected' WHERE technician_id = ?`;
  db.query(sql, [technician_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Technician not found' });
    
    // Emit real-time event
    getIO()?.rt.userRejected({ user_id: technician_id, role: 'technician' });
    
    res.json({ message: 'Technician rejected' });
  });
};


