const db = require('../config/db');
const { getIO } = require('../realtime');

// --- Profile ---
exports.getProfile = (req, res) => {
    const technician_id = req.user.id;
    const sql = `SELECT * FROM technicians WHERE technician_id = ?`;
    db.query(sql, [technician_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ message: 'Technician not found' });
        // Exclude password
        const { password, ...profile } = results[0];
        res.json(profile);
    });
};

exports.updateProfile = (req, res) => {
    const technician_id = req.user.id;
    const { first_name, last_name, contact_number, email, service_area, specialization } = req.body;
    const sql = `
        UPDATE technicians 
        SET first_name = ?, last_name = ?, contact_number = ?, email = ?, service_area = ?, specialization = ?
        WHERE technician_id = ?
    `;
    db.query(sql, [first_name, last_name, contact_number, email, service_area, specialization, technician_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profile updated successfully' });
    });
};

// --- Requests ---
exports.getMyRequests = (req, res) => {
    const technician_id = req.user.id;
    const sql = `
        SELECT 
            sr.service_request_id,
            sr.customer_id,
            sr.technician_id,
            sr.appliance_id,
            sr.issue_description,
            sr.service_address,
            sr.status,
            sr.appointment_date,
            sr.created_at as request_date,
            c.first_name as customer_first_name,
            c.last_name as customer_last_name,
            c.contact_number as customer_phone,
            c.email as customer_email
        FROM service_requests sr
        LEFT JOIN customers c ON sr.customer_id = c.customer_id
        WHERE sr.technician_id = ?
        ORDER BY sr.appointment_date DESC
    `;
    db.query(sql, [technician_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const mapped = (results || []).map((row) => ({
            ...row,
            service_request_id: row.service_request_id,
            issue_description: row.issue_description,
            appointment_date: row.appointment_date,
            status: row.status,
            request_date: row.request_date,
        }));
        res.json(mapped);
    });
};

// --- Services Catalog ---
exports.getMyServices = (req, res) => {
    const technician_id = req.user.id;
    console.debug('[TechnicianAPI] getMyServices -> technician_id:', technician_id);
    const sql = `SELECT * FROM technician_services WHERE technician_id = ? ORDER BY created_at DESC`;
    db.query(sql, [technician_id], (err, results) => {
        if (err) {
            console.error('[TechnicianAPI] getMyServices -> DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.debug('[TechnicianAPI] getMyServices -> rows:', results.length);
        // Map DB fields to frontend expected fields
        const mapped = (results || []).map(s => ({
            id: String(s.id),
            serviceName: s.service_name,
            category: s.category,
            description: s.description,
            startingPrice: s.starting_price,
            duration: s.duration,
            serviceType: s.service_type,
            isAvailable: !!s.is_available,
            isActive: !!s.is_active,
            created_at: s.created_at
        }));
        res.json(mapped || []);
    });
};

exports.createService = (req, res) => {
    const technician_id = req.user.id;
    const { serviceName, category, description, startingPrice, duration, serviceType, isAvailable, isActive } = req.body;

    console.debug('[TechnicianAPI] createService -> payload:', { body: req.body });
    console.debug('[TechnicianAPI] createService -> technician_id:', technician_id);
    
    const sql = `
        INSERT INTO technician_services 
        (technician_id, service_name, category, description, starting_price, duration, service_type, is_available, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [
        technician_id, serviceName, category, description, startingPrice, duration, serviceType, 
        isAvailable !== false, isActive !== false
    ], (err, result) => {
        if (err) {
            console.error('[TechnicianAPI] createService -> DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.info('[TechnicianAPI] createService -> inserted service id:', result.insertId);
        res.status(201).json({ message: 'Service created', id: String(result.insertId) });
    });
};

exports.updateService = (req, res) => {
    const technician_id = req.user.id;
    const service_id = req.params.id;
    const { serviceName, category, description, startingPrice, duration, serviceType, isAvailable, isActive } = req.body;
    
    const sql = `
        UPDATE technician_services 
        SET service_name = ?, category = ?, description = ?, starting_price = ?, duration = ?, 
            service_type = ?, is_available = ?, is_active = ?
        WHERE id = ? AND technician_id = ?
    `;
    
    db.query(sql, [
        serviceName, category, description, startingPrice, duration, serviceType, 
        isAvailable, isActive, service_id, technician_id
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Service not found or unauthorized' });
        res.json({ message: 'Service updated' });
    });
};

exports.deleteService = (req, res) => {
    const technician_id = req.user.id;
    const service_id = req.params.id;
    
    const sql = `DELETE FROM technician_services WHERE id = ? AND technician_id = ?`;
    db.query(sql, [service_id, technician_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Service not found or unauthorized' });
        res.json({ message: 'Service deleted' });
    });
};
