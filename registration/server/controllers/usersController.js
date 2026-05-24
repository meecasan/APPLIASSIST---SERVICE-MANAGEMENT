const db = require('../config/db');

const mapUserType = (type) => {
  if (type === 'customers') return { table: 'customers', pk: 'customer_id' };
  if (type === 'technicians') return { table: 'technicians', pk: 'technician_id' };
  if (type === 'store_owners') return { table: 'store_owners', pk: 'store_owner_id' };
  return null;
};

const normalizeFields = (fields) => {
  if (!fields.includes('status') && fields.includes('account_status')) return fields.map(f => f === 'account_status' ? 'status' : f);
  return fields;
};

exports.list = (req, res) => {
  const { type } = req.params;
  const mapping = mapUserType(type);
  if (!mapping) return res.status(400).json({ message: 'Invalid type' });
  db.query(`SELECT ${mapping.pk} AS id, first_name, middle_name, last_name, email, contact_number, account_status AS status, created_at FROM ${mapping.table}`, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.get = (req, res) => {
  const { type, id } = req.params;
  const mapping = mapUserType(type);
  if (!mapping) return res.status(400).json({ message: 'Invalid type' });
  db.query(`SELECT ${mapping.pk} AS id, first_name, middle_name, last_name, email, contact_number, account_status AS status, created_at FROM ${mapping.table} WHERE ${mapping.pk} = ?`, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: 'Not found' });
    res.json(results[0]);
  });
};

exports.update = (req, res) => {
  const { type, id } = req.params;
  const mapping = mapUserType(type);
  if (!mapping) return res.status(400).json({ message: 'Invalid type' });
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ message: 'No fields' });
  const set = keys.map(k => `${k}=?`).join(',');
  const params = keys.map(k => fields[k]);
  params.push(id);
  db.query(`UPDATE ${mapping.table} SET ${set} WHERE ${mapping.pk} = ?`, params, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Updated' });
  });
};

exports.delete = (req, res) => {
  const { type, id } = req.params;
  const mapping = mapUserType(type);
  if (!mapping) return res.status(400).json({ message: 'Invalid type' });
  db.query(`DELETE FROM ${mapping.table} WHERE ${mapping.pk} = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Deleted' });
  });
};
