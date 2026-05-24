const db = require('../config/db');
const { getIO } = require('../realtime');

exports.createProduct = (req, res) => {
  const { store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status } = req.body;
  if (!store_id || !part_name || !category || !description || price == null || stock_quantity == null) return res.status(400).json({ message: 'Missing required fields' });
  const sql = `INSERT INTO appliance_parts (store_id,part_name,part_number,category,description,price,stock_quantity,compatibility,status) VALUES (?,?,?,?,?,?,?,?,?)`;
  db.query(sql, [store_id, part_name, part_number || null, category, description, price, stock_quantity, compatibility || null, status || 'Available'], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ part_id: result.insertId, message: 'Part created' });
  });
};

exports.getProduct = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM appliance_parts WHERE part_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: 'Not found' });
    res.json(results[0]);
  });
};

exports.listProducts = (req, res) => {
  const { store_id } = req.query;
  const sql = store_id ? 'SELECT * FROM appliance_parts WHERE store_id = ?' : 'SELECT * FROM appliance_parts';
  const params = store_id ? [store_id] : [];
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { part_name, part_number, category, description, price, stock_quantity, compatibility, status } = req.body;
  
  // Build dynamic UPDATE query for partial updates
  const updates = [];
  const values = [];
  
  if (part_name !== undefined) {
    updates.push('part_name=?');
    values.push(part_name);
  }
  if (part_number !== undefined) {
    updates.push('part_number=?');
    values.push(part_number);
  }
  if (category !== undefined) {
    updates.push('category=?');
    values.push(category);
  }
  if (description !== undefined) {
    updates.push('description=?');
    values.push(description);
  }
  if (price !== undefined) {
    updates.push('price=?');
    values.push(price);
  }
  if (stock_quantity !== undefined) {
    updates.push('stock_quantity=?');
    values.push(stock_quantity);
  }
  if (compatibility !== undefined) {
    updates.push('compatibility=?');
    values.push(compatibility);
  }
  if (status !== undefined) {
    updates.push('status=?');
    values.push(status);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }
  
  values.push(id);
  const sql = `UPDATE appliance_parts SET ${updates.join(',')} WHERE part_id=?`;
  
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err });
    
    // Emit real-time event for stock update if stock_quantity was updated
    if (stock_quantity !== undefined) {
      db.query('SELECT store_id, part_name FROM appliance_parts WHERE part_id = ?', [id], (qErr, rows) => {
        if (!qErr && rows.length) {
          getIO()?.rt.stockUpdated({ 
            product_id: id, 
            store_id: rows[0].store_id, 
            product_name: rows[0].part_name, 
            stock_quantity 
          });
        }
      });
    }
    
    res.json({ message: 'Part updated' });
  });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM appliance_parts WHERE part_id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Part deleted' });
  });
};

exports.updateStock = (req, res) => {
  const { id } = req.params;
  const { delta } = req.body;
  if (typeof delta !== 'number') return res.status(400).json({ message: 'delta must be number' });
  db.query('UPDATE appliance_parts SET stock_quantity = stock_quantity + ? WHERE part_id = ?', [delta, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    
    // Fetch updated product info and emit event
    db.query('SELECT store_id, part_name, stock_quantity FROM appliance_parts WHERE part_id = ?', [id], (qErr, rows) => {
      if (!qErr && rows.length) {
        getIO()?.rt.stockUpdated({ 
          product_id: id, 
          store_id: rows[0].store_id, 
          product_name: rows[0].part_name, 
          stock_quantity: rows[0].stock_quantity 
        });
      }
    });
    
    res.json({ message: 'Stock updated' });
  });
};

exports.addProductImage = (req, res) => {
  const { part_id, url } = req.body;
  if (!part_id || !url) return res.status(400).json({ message: 'Missing required fields' });
  db.query('INSERT INTO product_images (part_id,image_path) VALUES (?,?)', [part_id, url], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ image_id: result.insertId, message: 'Image added' });
  });
};

exports.uploadImage = (req, res) => {
  const file = req.file;
  const { id } = req.params; // part id
  if (!file) return res.status(400).json({ message: 'No file uploaded' });
  const image_path = `/uploads/${file.filename}`;
  db.query('INSERT INTO product_images (part_id,image_path) VALUES (?,?)', [id, image_path], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ image_id: result.insertId, image_path, message: 'Image uploaded' });
  });
};
