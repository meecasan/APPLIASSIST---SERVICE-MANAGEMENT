const db = require('../config/db');
const { getIO } = require('../realtime');

const resolveNotificationColumns = async () => new Promise((resolve, reject) => {
  db.query('SHOW COLUMNS FROM notifications', (err, cols) => {
    if (err) return reject(err);
    const fields = cols.map(c => c.Field);
    resolve({ fields });
  });
});

exports.createNotification = async (req, res) => {
  const { recipient_type, recipient_id, notification_type, message, payload } = req.body;
  if (!recipient_type || !recipient_id || !notification_type || !message) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const { fields } = await resolveNotificationColumns();
    const insertFields = [];
    const placeholders = [];
    const values = [];

    if (fields.includes('recipient_type')) { insertFields.push('recipient_type'); placeholders.push('?'); values.push(recipient_type); }
    if (fields.includes('recipient_id')) { insertFields.push('recipient_id'); placeholders.push('?'); values.push(recipient_id); }
    if (fields.includes('notification_type')) { insertFields.push('notification_type'); placeholders.push('?'); values.push(notification_type); }
    if (fields.includes('message')) { insertFields.push('message'); placeholders.push('?'); values.push(message); }
    if (fields.includes('payload')) { insertFields.push('payload'); placeholders.push('?'); values.push(JSON.stringify(payload || {})); }
    if (fields.includes('created_at') && !fields.includes('createdAt')) { /* no-op */ }
    if (fields.includes('is_read')) { insertFields.push('is_read'); placeholders.push('?'); values.push(0); }
    else if (fields.includes('read_flag')) { insertFields.push('read_flag'); placeholders.push('?'); values.push(0); }

    if (insertFields.length === 0) return res.status(400).json({ message: 'No compatible columns found for notifications' });

    const sql = `INSERT INTO notifications (${insertFields.join(',')}) VALUES (${placeholders.join(',')})`;
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // Emit real-time event
      getIO()?.rt.notificationNew({
        notification_id: result.insertId,
        user_id: recipient_id,
        message,
        type: notification_type
      });

      res.json({ notification_id: result.insertId, message: 'Notification created' });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.listNotifications = async (req, res) => {
  const { recipient_type, recipient_id } = req.query;
  if (!recipient_type || !recipient_id) return res.status(400).json({ message: 'Missing required query params' });
  try {
    const { fields } = await resolveNotificationColumns();
    const recipientTypeField = fields.includes('recipient_type') ? 'recipient_type' : 'user_type';
    const recipientIdField = fields.includes('recipient_id') ? 'recipient_id' : 'user_id';
    const createdAtField = fields.includes('created_at') ? 'created_at' : (fields.includes('createdAt') ? 'createdAt' : null);
    const orderBy = createdAtField ? ` ORDER BY ${createdAtField} DESC` : '';
    const sql = `SELECT * FROM notifications WHERE ${recipientTypeField} = ? AND ${recipientIdField} = ?${orderBy}`;
    db.query(sql, [recipient_type, recipient_id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.markRead = async (req, res) => {
  const { id } = req.params;
  try {
    const { fields } = await resolveNotificationColumns();
    const flagField = fields.includes('is_read') ? 'is_read' : (fields.includes('read_flag') ? 'read_flag' : null);
    const pkField = fields.includes('notification_id') ? 'notification_id' : 'id';
    if (!flagField) return res.status(500).json({ message: 'No read flag column found' });
    db.query(`UPDATE notifications SET ${flagField} = 1 WHERE ${pkField} = ?`, [id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Marked read' });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
