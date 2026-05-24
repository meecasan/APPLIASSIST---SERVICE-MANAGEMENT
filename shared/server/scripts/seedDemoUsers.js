/**
 * Seed Demo Users with Proper Bcrypt Hashes
 * This script creates demo users for testing all user roles
 * 
 * Usage: npm run seed:demo
 * Add to server/package.json scripts: "seed:demo": "node scripts/seedDemoUsers.js"
 */

const db = require('../config/db');
const bcrypt = require('bcrypt');

const seedDemoUsers = async () => {
  try {
    console.log('🌱 Seeding demo users...\n');

    // Hash the demo password
    const demoPassword = 'password123';
    const adminPassword = 'admin123';
    
    const demoHashedPassword = await bcrypt.hash(demoPassword, 10);
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log('✓ Passwords hashed with bcrypt\n');

    // =========================================================================
    // SEED ADMIN USER
    // =========================================================================
    console.log('👨‍💼 Creating Admin User...');
    const adminQuery = `
      INSERT INTO admins (first_name, last_name, email, password)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password = VALUES(password),
        first_name = VALUES(first_name),
        last_name = VALUES(last_name)
    `;
    
    db.query(adminQuery, ['Admin', 'User', 'admin@appliassist.ph', adminHashedPassword], (err, result) => {
      if (err) {
        console.error('  ❌ Error creating admin:', err.message);
      } else {
        console.log('  ✓ Admin user: admin@appliassist.ph (password: admin123)\n');
      }
    });

    // =========================================================================
    // SEED TECHNICIAN USERS
    // =========================================================================
    console.log('👨‍🔧 Creating Technician Users...');
    
    const technicianQueries = [
      {
        email: 'tech@example.com',
        firstName: 'John',
        lastName: 'Technician',
        status: 'Approved',
      },
      {
        email: 'newtech@example.com',
        firstName: 'Jane',
        lastName: 'NewTech',
        status: 'Pending',
      },
    ];

    for (const tech of technicianQueries) {
      const techQuery = `
        INSERT INTO technicians (first_name, last_name, email, password, contact_number, specialization, service_area, account_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          password = VALUES(password),
          account_status = VALUES(account_status),
          first_name = VALUES(first_name),
          last_name = VALUES(last_name)
      `;

      db.query(
        techQuery,
        [tech.firstName, tech.lastName, tech.email, demoHashedPassword, '555-0001', 'General Repair', 'Naga City', tech.status],
        (err, result) => {
          if (err) {
            console.error(`  ❌ Error creating technician ${tech.email}:`, err.message);
          } else {
            console.log(`  ✓ Technician: ${tech.email} (status: ${tech.status})`);
          }
        }
      );
    }
    console.log('');



    // =========================================================================
    // SEED CUSTOMER USERS
    // =========================================================================
    console.log('🛒 Creating Customer Users...');
    
    const customerQueries = [
      {
        email: 'customer@example.com',
        firstName: 'Alice',
        lastName: 'Customer',
      },
      {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    ];

    for (const customer of customerQueries) {
      const customerQuery = `
        INSERT INTO customers (first_name, last_name, email, password, contact_number, address, account_status)
        VALUES (?, ?, ?, ?, ?, ?, 'Active')
        ON DUPLICATE KEY UPDATE
          password = VALUES(password),
          account_status = 'Active',
          first_name = VALUES(first_name),
          last_name = VALUES(last_name)
      `;

      db.query(
        customerQuery,
        [customer.firstName, customer.lastName, customer.email, demoHashedPassword, '555-0003', 'Naga City, Camarines Sur'],
        (err, result) => {
          if (err) {
            console.error(`  ❌ Error creating customer ${customer.email}:`, err.message);
          } else {
            console.log(`  ✓ Customer: ${customer.email}`);
          }
        }
      );
    }
    console.log('');

    console.log('✅ Demo users seeding completed!');
    console.log('\n📝 Demo Credentials (password: password123 for all except admin which is admin123):');
    console.log('  - Admin: admin@appliassist.ph (password: admin123)');
    console.log('  - Technician (Approved): tech@example.com');
    console.log('  - Technician (Pending): newtech@example.com');
    console.log('  - Customer: customer@example.com or john@example.com\n');

    // Keep the process alive a bit to ensure all queries complete
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedDemoUsers();
