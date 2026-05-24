const db = require('../config/db');

exports.getAllServices = (req, res) => {
    // Join technician_services with technicians to get full info for the catalog
    const sql = `
        SELECT 
            s.id as service_id,
            s.technician_id,
            s.service_name,
            s.category,
            s.description,
            s.starting_price,
            s.duration,
            s.service_type,
            s.is_available,
            s.is_active,
            s.created_at,
            t.first_name,
            t.last_name,
            t.specialization,
            t.service_area
        FROM technician_services s
        JOIN technicians t ON s.technician_id = t.technician_id
        WHERE s.is_active = TRUE AND s.is_available = TRUE
        ORDER BY s.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('[Catalog] getAllServices -> DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.debug('[Catalog] getAllServices -> rowCount:', (results || []).length);
        res.json(results || []);
    });
};

exports.getServicesByTechnician = (req, res) => {
    const { technician_id } = req.params;
    if (!technician_id) return res.status(400).json({ error: 'technician_id required' });

    const sql = `
        SELECT 
            s.id as service_id,
            s.technician_id,
            s.service_name,
            s.category,
            s.description,
            s.starting_price,
            s.duration,
            s.service_type,
            s.is_available,
            s.is_active,
            s.created_at,
            t.first_name,
            t.last_name,
            t.specialization,
            t.service_area
        FROM technician_services s
        JOIN technicians t ON s.technician_id = t.technician_id
        WHERE s.technician_id = ? AND s.is_active = TRUE AND s.is_available = TRUE
        ORDER BY s.created_at DESC
    `;

    db.query(sql, [technician_id], (err, results) => {
        if (err) {
            console.error('[Catalog] getServicesByTechnician -> DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.debug('[Catalog] getServicesByTechnician -> technician_id:', technician_id, 'rows:', (results || []).length);
        res.json(results || []);
    });
};

// Get services filtered by category (used by TechnicianMarketplace)
exports.getServicesByCategory = (req, res) => {
    const { category } = req.params;
    if (!category) return res.status(400).json({ error: 'category required' });

    const sql = `
        SELECT 
            s.id as service_id,
            s.technician_id,
            s.service_name,
            s.category,
            s.description,
            s.starting_price,
            s.duration,
            s.service_type,
            s.is_available,
            s.is_active,
            s.created_at,
            t.first_name,
            t.last_name,
            t.specialization,
            t.service_area,
            t.contact_number,
            t.email
        FROM technician_services s
        JOIN technicians t ON s.technician_id = t.technician_id
        WHERE s.category = ? AND s.is_active = TRUE AND s.is_available = TRUE
            AND t.account_status = 'Approved'
        ORDER BY s.created_at DESC
    `;

    db.query(sql, [category], (err, results) => {
        if (err) {
            console.error('[Catalog] getServicesByCategory -> DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.debug('[Catalog] getServicesByCategory -> category:', category, 'rows:', (results || []).length);
        res.json(results || []);
    });
};
