const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '1d';

// Register customer
exports.registerCustomer = async (req, res) => {
    const { first_name, middle_name, last_name, email, password, contact_number, address } = req.body;
    if (!email || !password || !first_name || !last_name || !contact_number || !address) return res.status(400).json({ message: 'Missing required fields' });
    try {
        const hashed = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO customers (first_name,middle_name,last_name,email,password,contact_number,address) VALUES (?,?,?,?,?,?,?)`;
        db.query(sql, [first_name, middle_name || null, last_name, email, hashed, contact_number, address], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Customer registered' });
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Register technician (pending approval)
exports.registerTechnician = async (req, res) => {
    const { first_name, middle_name, last_name, email, password, contact_number, specialization, service_area } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !contact_number || !specialization) {
        return res.status(400).json({ message: 'Missing required fields: email, password, first_name, contact_number, specialization' });
    }

    // last_name falls back to first_name if not provided (single-name entry)
    const resolvedLastName = (last_name && last_name.trim()) ? last_name.trim() : first_name.trim();

    try {
        // Check for duplicate email
        db.query('SELECT technician_id FROM technicians WHERE email = ?', [email.trim()], async (dupErr, dupRows) => {
            if (dupErr) return res.status(500).json({ error: dupErr.message });
            if (dupRows && dupRows.length > 0) {
                return res.status(409).json({ message: 'An account with this email already exists.' });
            }

            try {
                const hashed = await bcrypt.hash(password, 10);
                const sql = `INSERT INTO technicians (first_name,middle_name,last_name,email,password,contact_number,specialization,service_area) VALUES (?,?,?,?,?,?,?,?)`;
                db.query(sql, [
                    first_name.trim(),
                    middle_name ? middle_name.trim() : null,
                    resolvedLastName,
                    email.trim(),
                    hashed,
                    contact_number.trim(),
                    specialization.trim(),
                    service_area ? service_area.trim() : null
                ], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Technician registered (pending approval)' });
                });
            } catch (hashErr) {
                res.status(500).json({ error: hashErr.message });
            }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};



// Login across user tables (admin, store_owner, technician, customer)
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    // helper to check a table
    const checkTable = (table) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (!results || results.length === 0) {
                return resolve(null);
            }
            return resolve({ row: results[0], table });
        });
    });

    try {
        const tables = ['admins','technicians','customers'];
        let found = null;
        for (const t of tables) {
            // eslint-disable-next-line no-await-in-loop
            const r = await checkTable(t);
            if (r) { found = r; break; }
        }
        
        if (!found) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = found.row;
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // if technician require approval; if customer require active status
        if (found.table === 'technicians') {
            if (user.account_status !== 'Approved') {
                return res.status(403).json({ message: 'Account not approved yet' });
            }
        }
        if (found.table === 'customers') {
            if (user.account_status !== 'Active') {
                return res.status(403).json({ message: 'Account is not active' });
            }
        }

        // determine a usable id field from the returned row (id, customer_id, admin_id, etc.)
        const idField = ['id','customer_id','admin_id','technician_id'].find(f => Object.prototype.hasOwnProperty.call(user, f));
        const uid = idField ? user[idField] : user.id || null;
        
        const roleMapping = {
            'admins': 'admin',
            'technicians': 'technician',
            'customers': 'customer'
        };
        
        const role = roleMapping[found.table] || found.table.replace(/s$/,'');
        const payload = { id: uid, email: user.email, role };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        res.json({ message: 'Login successful', token, role, user_id: uid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
