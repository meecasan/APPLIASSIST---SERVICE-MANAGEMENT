const db = require('../config/db');
const bcrypt = require('bcrypt');

const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@example.com';
const username = process.argv[3] || process.env.ADMIN_USERNAME || 'admin';
const plain = process.argv[4] || process.env.ADMIN_PASSWORD || 'admin123';

async function seed() {
  try {
    const hashed = await bcrypt.hash(plain, 10);
    // detect columns in admins table
    db.query('SHOW COLUMNS FROM admins', (cErr, cols) => {
      if (cErr) {
        console.error('Could not inspect admins table', cErr);
        process.exit(1);
      }
      console.log('admins columns:', cols);
      const hasUsername = cols.some(c => c.Field === 'username');
      // determine valid role value if enum
      let validRole = null;
      const roleCol = cols.find(c => c.Field === 'role');
      if (roleCol && roleCol.Type && roleCol.Type.startsWith("enum(")) {
        try {
          const inside = roleCol.Type.match(/enum\((.*)\)/)[1];
          const opts = inside.split(',').map(s => s.replace(/^'|'$/g, '').trim());
          if (opts.includes('Super Admin')) validRole = 'Super Admin';
          else validRole = opts[0] || null;
        } catch (e) { /* ignore */ }
      }
      // check if admin exists
      db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
        if (err) {
          console.error('DB error', err);
          process.exit(1);
        }
        if (results && results.length > 0) {
          // update password (and username if present)
          if (hasUsername) {
            db.query('UPDATE admins SET username = ?, password = ? WHERE email = ?', [username, hashed, email], (uErr) => {
              if (uErr) console.error('Update error', uErr);
              else console.log('Admin updated:', email);
              process.exit(0);
            });
          } else {
            // try updating password and role if present
            const updates = [];
            const params = [];
            if (cols.some(c => c.Field === 'password')) { updates.push('password = ?'); params.push(hashed); }
            if (cols.some(c => c.Field === 'role')) { updates.push('role = ?'); params.push(validRole || 'Super Admin'); }
            if (updates.length === 0) {
              console.error('No updatable fields found on admins table');
              process.exit(1);
            }
            const sql = `UPDATE admins SET ${updates.join(', ')} WHERE email = ?`;
            params.push(email);
            db.query(sql, params, (uErr) => {
              if (uErr) console.error('Update error', uErr);
              else console.log('Admin updated (adapted):', email);
              process.exit(0);
            });
          }
        } else {
          // construct insert with required/common fields
          const insertFields = [];
          const insertPlaceholders = [];
          const insertValues = [];
          if (hasUsername) {
            insertFields.push('username'); insertPlaceholders.push('?'); insertValues.push(username);
          }
          if (cols.some(c => c.Field === 'first_name')) { insertFields.push('first_name'); insertPlaceholders.push('?'); insertValues.push(username); }
          if (cols.some(c => c.Field === 'middle_name')) { insertFields.push('middle_name'); insertPlaceholders.push('?'); insertValues.push(''); }
          if (cols.some(c => c.Field === 'last_name')) { insertFields.push('last_name'); insertPlaceholders.push('?'); insertValues.push(''); }
          if (cols.some(c => c.Field === 'email')) { insertFields.push('email'); insertPlaceholders.push('?'); insertValues.push(email); }
          if (cols.some(c => c.Field === 'password')) { insertFields.push('password'); insertPlaceholders.push('?'); insertValues.push(hashed); }
            if (cols.some(c => c.Field === 'role')) { insertFields.push('role'); insertPlaceholders.push('?'); insertValues.push(validRole || 'Moderator'); }

          if (insertFields.length === 0) {
            console.error('No suitable fields to insert into admins table');
            process.exit(1);
          }
          const sql = `INSERT INTO admins (${insertFields.join(',')}) VALUES (${insertPlaceholders.join(',')})`;
          db.query(sql, insertValues, (iErr) => {
            if (iErr) console.error('Insert error', iErr);
            else console.log('Admin inserted (adapted):', email);
            process.exit(0);
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
