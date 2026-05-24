const db = require('../config/db');
const { getIO } = require('../realtime');

// Create order with details
exports.createOrder = (req, res) => {
  const { customer_id, store_id, items } = req.body; // items: [{part_id, quantity, unit_price}]
  if (!customer_id || !store_id || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Missing required fields' });

  const sql = 'INSERT INTO orders (store_id,customer_id,order_status) VALUES (?,?,?)';
  db.query(sql, [store_id, customer_id, 'Pending'], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    const orderId = result.insertId;
    const detailsSql = 'INSERT INTO order_details (order_id,part_id,quantity,unit_price,total_amount) VALUES ?';
    const values = items.map(i => [orderId, i.part_id, i.quantity, i.unit_price, i.unit_price * i.quantity]);
    db.query(detailsSql, [values], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      
      // Emit real-time event
      getIO()?.rt.orderNew({ order_id: orderId, customer_id, store_id, total_amount: items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0), status: 'Pending' });
      
      res.json({ order_id: orderId, message: 'Order created' });
    });
  });
};

exports.getOrder = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM orders WHERE order_id = ?', [id], (err, orders) => {
    if (err) return res.status(500).json({ error: err });
    if (!orders.length) return res.status(404).json({ message: 'Not found' });
    db.query('SELECT * FROM order_details WHERE order_id = ?', [id], (err2, details) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ order: orders[0], details });
    });
  });
};

exports.listOrders = (req, res) => {
  const { store_id, customer_id, status } = req.query;
  
  // Build query with joins to get more detailed information
  let sql = `
    SELECT o.*, 
           c.first_name as customer_first_name, c.last_name as customer_last_name, c.contact_number, c.address as customer_address,
           s.store_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN stores s ON o.store_id = s.store_id
    WHERE 1=1
  `;
  const params = [];
  
  if (store_id) { sql += ' AND o.store_id = ?'; params.push(store_id); }
  if (customer_id) { sql += ' AND o.customer_id = ?'; params.push(customer_id); }
  if (status) { sql += ' AND o.order_status = ?'; params.push(status); }
  
  sql += ' ORDER BY o.created_at DESC';
  
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get orders for a specific store (for store owners)
exports.getStoreOrders = (req, res) => {
  const { store_id } = req.params;
  const { status } = req.query;
  const currentUser = req.user;
  
  // Verify store ownership if user is a store_owner
  if (currentUser && currentUser.role === 'store_owner') {
    const checkSql = 'SELECT store_owner_id FROM stores WHERE store_id = ?';
    db.query(checkSql, [store_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ message: 'Store not found' });
      
      // Get store_owner_id from store_owners table
      const userSql = 'SELECT store_owner_id FROM store_owners WHERE email = ?';
      db.query(userSql, [currentUser.email], (err, userResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!userResults.length || userResults[0].store_owner_id !== results[0].store_owner_id) {
          return res.status(403).json({ message: 'You do not have permission to view this store\'s orders' });
        }
        
        // Fetch orders for this store
        fetchStoreOrders(store_id, status, res);
      });
    });
  } else {
    // Admin can view any store's orders
    fetchStoreOrders(store_id, status, res);
  }
};

// Helper function to fetch store orders
function fetchStoreOrders(store_id, status, res) {
  let sql = `
    SELECT o.*, 
           c.first_name as customer_first_name, c.last_name as customer_last_name, c.contact_number, c.address as customer_address,
           s.store_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN stores s ON o.store_id = s.store_id
    WHERE o.store_id = ?
  `;
  const params = [store_id];
  
  if (status) {
    sql += ' AND o.order_status = ?';
    params.push(status);
  }
  
  sql += ' ORDER BY o.created_at DESC';
  
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
}

// Update order status; on confirm deduct stock
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'Missing status' });

  if (status === 'Confirmed') {
    db.beginTransaction(err => {
      if (err) return res.status(500).json({ error: err });
      db.query('SELECT * FROM order_details WHERE order_id = ?', [id], (err2, items) => {
        if (err2) return db.rollback(() => res.status(500).json({ error: err2 }));
        const checks = items.map(it => new Promise((resolve, reject) => {
          db.query('SELECT stock_quantity FROM appliance_parts WHERE part_id = ?', [it.part_id], (e, rows) => {
            if (e) return reject(e);
            if (!rows.length || rows[0].stock_quantity < it.quantity) return reject(new Error('Insufficient stock'));
            resolve();
          });
        }));
        Promise.all(checks).then(() => {
          const updates = items.map(it => new Promise((resolve, reject) => {
            db.query('UPDATE appliance_parts SET stock_quantity = stock_quantity - ? WHERE part_id = ?', [it.quantity, it.part_id], (e) => e ? reject(e) : resolve());
          }));
          Promise.all(updates).then(() => {
            db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [status, id], (e3) => {
              if (e3) return db.rollback(() => res.status(500).json({ error: e3 }));
              db.commit((cErr) => {
                if (cErr) return db.rollback(() => res.status(500).json({ error: cErr }));
                // Fetch order details for emit
                db.query('SELECT customer_id, store_id FROM orders WHERE order_id = ?', [id], (qErr, rows) => {
                  if (!qErr && rows.length) {
                    getIO()?.rt.orderUpdated({ order_id: id, customer_id: rows[0].customer_id, store_id: rows[0].store_id, status });
                  }
                  res.json({ message: 'Order confirmed and stock deducted' });
                });
              });
            });
          }).catch(uErr => db.rollback(() => res.status(500).json({ error: uErr.message })));
        }).catch(checkErr => db.rollback(() => res.status(400).json({ error: checkErr.message })));
      });
    });
  } else {
    db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [status, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      // Fetch order details for emit
      db.query('SELECT customer_id, store_id FROM orders WHERE order_id = ?', [id], (qErr, rows) => {
        if (!qErr && rows.length) {
          getIO()?.rt.orderUpdated({ order_id: id, customer_id: rows[0].customer_id, store_id: rows[0].store_id, status });
        }
        res.json({ message: 'Order status updated' });
      });
    });
  }
};

exports.deleteOrder = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM orders WHERE order_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Order deleted' });
  });
};

