const db = require('../config/db');

// Helper function to check store ownership
const checkStoreOwnership = (storeId, userId, userRole, callback) => {
  if (userRole === 'admin') {
    return callback(true);
  }
  
  const sql = 'SELECT store_owner_id FROM stores WHERE store_id = ?';
  db.query(sql, [storeId], (err, results) => {
    if (err || !results.length) {
      return callback(false);
    }
    const store = results[0];
    // Check if the current user owns this store
    callback(store.store_owner_id === userId);
  });
};

exports.createStore = async (req, res) => {
  const { store_owner_id, store_name, store_type, store_address } = req.body;
  const currentUser = req.user;
  
  // Validate required fields
  if (!store_name || !store_address) {
    return res.status(400).json({ message: 'Missing required fields: store_name and store_address are required' });
  }
  
  // If user is a store_owner, they can only create stores for themselves
  let ownerId = store_owner_id;
  if (currentUser.role === 'store_owner') {
    // Get the store_owner_id from users table based on email
    const userSql = 'SELECT store_owner_id FROM store_owners WHERE email = ?';
    try {
      const [userResults] = await new Promise((resolve, reject) => {
        db.query(userSql, [currentUser.email], (err, results) => {
          if (err) reject(err);
          else resolve([results]);
        });
      });
      
      if (!userResults || userResults.length === 0) {
        return res.status(403).json({ message: 'Store owner account not found' });
      }
      ownerId = userResults[0].store_owner_id;
    } catch (err) {
      return res.status(500).json({ error: 'Failed to verify store owner' });
    }
  }
  
  if (!ownerId) {
    return res.status(400).json({ message: 'Store owner ID is required' });
  }
  
  const sql = `INSERT INTO stores (store_owner_id, store_name, store_type, store_address) VALUES (?, ?, ?, ?)`;
  db.query(sql, [ownerId, store_name, store_type || 'Appliance Parts', store_address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ store_id: result.insertId, message: 'Store created successfully' });
  });
};

exports.getStore = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT s.*, so.email as owner_email, so.first_name as owner_first_name, so.last_name as owner_last_name
    FROM stores s
    LEFT JOIN store_owners so ON s.store_owner_id = so.store_owner_id
    WHERE s.store_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: 'Store not found' });
    res.json(results[0]);
  });
};

exports.listStores = (req, res) => {
  const { owner_id, search, type } = req.query;
  let sql = `
    SELECT s.*, so.email as owner_email, so.first_name as owner_first_name, so.last_name as owner_last_name
    FROM stores s
    LEFT JOIN store_owners so ON s.store_owner_id = so.store_owner_id
    WHERE 1=1
  `;
  const params = [];
  
  if (owner_id) {
    sql += ' AND s.store_owner_id = ?';
    params.push(owner_id);
  }
  
  if (type) {
    sql += ' AND s.store_type = ?';
    params.push(type);
  }
  
  if (search) {
    sql += ' AND (s.store_name LIKE ? OR s.store_address LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  sql += ' ORDER BY s.store_name ASC';
  
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get stores owned by the current user (for store owners)
exports.getMyStores = (req, res) => {
  const currentUser = req.user;
  
  // First get the store_owner_id from the email
  const userSql = 'SELECT store_owner_id FROM store_owners WHERE email = ?';
  db.query(userSql, [currentUser.email], (err, userResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!userResults || userResults.length === 0) {
      return res.status(404).json({ message: 'Store owner account not found' });
    }
    
    const storeOwnerId = userResults[0].store_owner_id;
    const storesSql = 'SELECT * FROM stores WHERE store_owner_id = ? ORDER BY store_name ASC';
    
    db.query(storesSql, [storeOwnerId], (err, stores) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(stores);
    });
  });
};

exports.updateStore = (req, res) => {
  const { id } = req.params;
  const { store_name, store_type, store_address } = req.body;
  const currentUser = req.user;
  
  // Check ownership before allowing update
  checkStoreOwnership(parseInt(id), currentUser.id, currentUser.role, (isOwner) => {
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not have permission to update this store' });
    }
    
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    
    if (store_name !== undefined) {
      updates.push('store_name = ?');
      values.push(store_name);
    }
    if (store_type !== undefined) {
      updates.push('store_type = ?');
      values.push(store_type);
    }
    if (store_address !== undefined) {
      updates.push('store_address = ?');
      values.push(store_address);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    values.push(id);
    const sql = `UPDATE stores SET ${updates.join(', ')} WHERE store_id = ?`;
    
    db.query(sql, values, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Store updated successfully' });
    });
  });
};

exports.deleteStore = (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  
  // Check ownership before allowing delete
  checkStoreOwnership(parseInt(id), currentUser.id, currentUser.role, (isOwner) => {
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not have permission to delete this store' });
    }
    
    const sql = 'DELETE FROM stores WHERE store_id = ?';
    db.query(sql, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Store deleted successfully' });
    });
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
