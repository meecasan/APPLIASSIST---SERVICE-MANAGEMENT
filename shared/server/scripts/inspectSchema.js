const db = require('../config/db');
const tables = ['admins','customers','store_owners','technicians','stores','products','orders','order_details','service_requests','notifications','appliances'];
let i = 0;
function next() {
  if (i >= tables.length) return process.exit(0);
  const t = tables[i++];
  db.query('SHOW TABLES LIKE ?', [t], (err, tbls) => {
    if (err) { console.error(t, err); next(); return; }
    if (!tbls.length) { console.log(`${t}: missing`); next(); return; }
    db.query('SHOW COLUMNS FROM ' + t, (e, cols) => {
      console.log('TABLE', t);
      console.log(cols);
      next();
    });
  });
}
next();
