const db = require('../config/db');

// Create a new store
exports.createStore = (req, res) => {
    const { store_name, store_type, store_address } = req.body;
    const store_owner_id = req.user.id; // Assuming user ID is available in req.user

    const sql = `INSERT INTO stores (store_name, store_type, store_address, store_owner_id) VALUES (?, ?, ?, ?)`;
    db.query(sql, [store_name, store_type, store_address, store_owner_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Store created successfully', store_id: result.insertId });
    });
};

// Get all stores
exports.getAllStores = (req, res) => {
    const sql = `SELECT * FROM stores`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// Get a single store by ID
exports.getStoreById = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM stores WHERE store_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Store not found' });
        res.status(200).json(results[0]);
    });
};

// Update a store
exports.updateStore = (req, res) => {
    const { id } = req.params;
    const { store_name, store_type, store_address } = req.body;
    const sql = `UPDATE stores SET store_name = ?, store_type = ?, store_address = ? WHERE store_id = ?`;
    db.query(sql, [store_name, store_type, store_address, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Store not found' });
        res.status(200).json({ message: 'Store updated successfully' });
    });
};

// Delete a store
exports.deleteStore = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM stores WHERE store_id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Store not found' });
        res.status(200).json({ message: 'Store deleted successfully' });
    });
};

// Check if store owner has a store profile
exports.checkStoreProfile = (req, res) => {
    const store_owner_id = req.user?.id;
    
    if (!store_owner_id) {
        return res.status(400).json({ message: 'Store owner ID required' });
    }
    
    const sql = `SELECT store_id FROM stores WHERE store_owner_id = ? LIMIT 1`;
    db.query(sql, [store_owner_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results && results.length > 0) {
            res.status(200).json({ hasProfile: true, store_id: results[0].store_id });
        } else {
            res.status(200).json({ hasProfile: false });
        }
    });
};