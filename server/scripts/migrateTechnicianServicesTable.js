const db = require('../config/db');

const sql = `
CREATE TABLE IF NOT EXISTS technician_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    technician_id INT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT NULL,
    description TEXT,
    starting_price DECIMAL(10,2) DEFAULT 0,
    duration VARCHAR(100) DEFAULT NULL,
    service_type VARCHAR(100) DEFAULT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (technician_id) REFERENCES technicians(technician_id) ON DELETE CASCADE
);
`;

console.log('[Migration] Creating technician_services table if not exists...');

db.query(sql, (err, result) => {
  if (err) {
    console.error('[Migration] Error executing migration:', err);
    process.exit(1);
  }
  console.log('[Migration] technician_services table ensured.');
  db.end(() => process.exit(0));
});
