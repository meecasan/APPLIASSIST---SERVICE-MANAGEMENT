/**
 * FIX #4: Contact Controller
 * Location: server/controllers/contactController.js (NEW FILE)
 * 
 * Handles contact form submissions and retrieval
 */

const db = require('../config/db');

/**
 * SQL to create contact_messages table if needed:
 * CREATE TABLE contact_messages (
 *   message_id INT AUTO_INCREMENT PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL,
 *   email VARCHAR(100) NOT NULL,
 *   phone VARCHAR(20),
 *   subject VARCHAR(255) NOT NULL,
 *   message TEXT NOT NULL,
 *   status ENUM('New', 'Read', 'Replied') DEFAULT 'New',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */

/**
 * Submit a contact form message
 * POST /api/contact
 */
exports.submitContact = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, subject, message',
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const sql = `
    INSERT INTO contact_messages (name, email, phone, subject, message, status)
    VALUES (?, ?, ?, ?, ?, 'New')
  `;

  db.query(
    sql,
    [name, email, phone || null, subject, message],
    (err, result) => {
      if (err) {
        console.error('Contact message creation error:', err);
        return res.status(500).json({
          error: 'Failed to submit contact message',
          details: err.message,
        });
      }

      res.status(201).json({
        message: 'Thank you for your message. We will get back to you soon.',
        message_id: result.insertId,
      });
    }
  );
};

/**
 * Get all contact messages (for admin)
 * GET /api/contact
 */
exports.getContactMessages = (req, res) => {
  const { status } = req.query;

  let sql = 'SELECT * FROM contact_messages';
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT 100';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }

    res.json(results || []);
  });
};
