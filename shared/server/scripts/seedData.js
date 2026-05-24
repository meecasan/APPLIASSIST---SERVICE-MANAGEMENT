/**
 * Comprehensive Database Seeding Script
 * This script populates the database with representative data for development
 * 
 * Usage: npm run seed
 * Add to server/package.json scripts: "seed": "node scripts/seedData.js"
 */

const db = require('../config/db');

// Helper function to execute queries sequentially
const executeQuery = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // =========================================================================
    // SEED STORE OWNERS (if not already existing)
    // =========================================================================
    console.log('📝 Seeding store owners...');
    const storeOwnerQueries = [
      {
        sql: `INSERT INTO store_owners (first_name, last_name, email, password, contact_number, address, account_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        values: [
          'John',
          'Smith',
          'owner1@appliassist.com',
          'hashed_password_here', // In production, use bcrypt
          '555-0001',
          '123 Business St, Downtown',
          'Approved',
        ],
      },
      {
        sql: `INSERT INTO store_owners (first_name, last_name, email, password, contact_number, address, account_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        values: [
          'Sarah',
          'Johnson',
          'owner2@appliassist.com',
          'hashed_password_here',
          '555-0002',
          '456 Commercial Ave, Midtown',
          'Approved',
        ],
      },
    ];

    for (const query of storeOwnerQueries) {
      try {
        await executeQuery(query.sql, query.values);
        console.log(`  ✓ Store owner: ${query.values[0]} ${query.values[1]}`);
      } catch (err) {
        // Likely duplicate, skip silently
      }
    }

    // =========================================================================
    // SEED STORES
    // =========================================================================
    console.log('\n🏪 Seeding stores...');
    const storeQueries = [
      {
        sql: `INSERT INTO stores (owner_id, store_name, address, phone, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [1, 'TechFix Store - Downtown', '123 Business St', '555-0001', 'Active'],
      },
      {
        sql: `INSERT INTO stores (owner_id, store_name, address, phone, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [
          1,
          'TechFix Store - Midtown',
          '456 Commercial Ave',
          '555-0002',
          'Active',
        ],
      },
      {
        sql: `INSERT INTO stores (owner_id, store_name, address, phone, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [2, 'ServiceHub Express', '789 Industrial Blvd', '555-0003', 'Active'],
      },
    ];

    for (const query of storeQueries) {
      try {
        await executeQuery(query.sql, query.values);
        console.log(`  ✓ Store: ${query.values[1]}`);
      } catch (err) {
        // Skip if already exists
      }
    }

    // =========================================================================
    // SEED PRODUCTS (Appliance Parts)
    // =========================================================================
    console.log('\n📦 Seeding products...');
    const productQueries = [
      // Refrigerator Parts
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          1,
          'Samsung Inverter Compressor RF28',
          'DA92-00214B',
          'Refrigerator Parts',
          'High-efficiency inverter compressor for Samsung refrigerators. Reduces energy consumption by 40%.',
          2450,
          15,
          'RF28HMEDBSR, RF28HDEDPRS, RF28HDEDPWW',
          'Available',
          '6 months',
        ],
      },
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          1,
          'LG Digital Thermostat LT-380',
          'LT-380A',
          'Refrigerator Parts',
          'Precision digital temperature control for LG refrigerators. Maintains optimal cooling efficiency.',
          850,
          32,
          'LT-380A, LT-380B, LT-380C',
          'Available',
          '3 months',
        ],
      },
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          1,
          'Whirlpool Door Gasket',
          'WP-DG48',
          'Refrigerator Parts',
          'Replacement door seal gasket. Prevents heat leakage and ensures proper cooling.',
          680,
          8,
          'WRF560SEYM, WRF560SEHZ, WRF560SMHZ',
          'Available',
          '3 months',
        ],
      },

      // Washing Machine Parts
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          2,
          'Panasonic Washing Machine Motor PM-520',
          'PM-520-P',
          'Washing Machine Parts',
          'Durable and efficient motor for automatic washing machines. Direct replacement.',
          1250,
          8,
          'NA-F80H6, NA-F90H6, NA-F100H6',
          'Available',
          '6 months',
        ],
      },
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          2,
          'LG Drum Bearing Kit',
          'LG-DBK-001',
          'Washing Machine Parts',
          'Complete bearing kit replacement for drum. Reduces noise and improves spin performance.',
          450,
          12,
          'LG Front Load Models 2018-2022',
          'Available',
          '1 year',
        ],
      },

      // AC Parts
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          1,
          'Carrier Air Filter Set HEPA-CF24',
          'HEPA-CF24-C',
          'Air Conditioner Parts',
          'Premium HEPA filter set. Captures 99.97% of particles. Easy installation.',
          350,
          56,
          '38MFQ009---3, 38MFQ012---3, 38MFQ018---3',
          'Available',
          '1 month',
        ],
      },
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          2,
          'Daikin Compressor Unit',
          'DK-COMP-5K',
          'Air Conditioner Parts',
          'Energy-efficient compressor unit. Ensures cool air circulation.',
          3200,
          4,
          'Daikin Split AC 5 Ton models',
          'Available',
          '1 year',
        ],
      },

      // Microwave Parts
      {
        sql: `INSERT INTO appliance_parts (store_id, part_name, part_number, category, description, price, stock_quantity, compatibility, status, warranty) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          1,
          'Samsung Magnetron Tube',
          'OM75P(31)',
          'Microwave Parts',
          'Replacement magnetron for microwave ovens. Direct replacement for heating elements.',
          580,
          6,
          'Samsung Microwave MW 2000W series',
          'Available',
          '6 months',
        ],
      },
    ];

    for (const query of productQueries) {
      try {
        await executeQuery(query.sql, query.values);
        console.log(`  ✓ Product: ${query.values[2]} - ₹${query.values[5]}`);
      } catch (err) {
        // Skip if already exists
      }
    }

    // =========================================================================
    // SEED SERVICES
    // =========================================================================
    console.log('\n🔧 Seeding services...');
    const serviceQueries = [
      {
        sql: `INSERT INTO services (service_type, description, hourly_rate, category, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [
          'Refrigerator Repair',
          'Comprehensive diagnosis and repair of cooling issues, including compressor service',
          500,
          'Refrigerator',
          'Available',
        ],
      },
      {
        sql: `INSERT INTO services (service_type, description, hourly_rate, category, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [
          'AC Installation',
          'Professional installation of new air conditioning units with warranty',
          800,
          'Air Conditioner',
          'Available',
        ],
      },
      {
        sql: `INSERT INTO services (service_type, description, hourly_rate, category, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [
          'Washing Machine Repair',
          'Fix water drainage problems, motor issues, and drum problems',
          450,
          'Washing Machine',
          'Available',
        ],
      },
      {
        sql: `INSERT INTO services (service_type, description, hourly_rate, category, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [
          'Microwave Maintenance',
          'Cleaning, magnetron replacement, and performance optimization',
          300,
          'Microwave',
          'Available',
        ],
      },
      {
        sql: `INSERT INTO services (service_type, description, hourly_rate, category, status) 
              VALUES (?, ?, ?, ?, ?)`,
        values: [
          'Comprehensive Home Service',
          'Multi-appliance diagnosis and repair for all home appliances',
          600,
          'General Maintenance',
          'Available',
        ],
      },
    ];

    for (const query of serviceQueries) {
      try {
        await executeQuery(query.sql, query.values);
        console.log(`  ✓ Service: ${query.values[0]} - ₹${query.values[2]}/hr`);
      } catch (err) {
        // Skip if already exists
      }
    }

    // =========================================================================
    // SEED TECHNICIANS (if applicable)
    // =========================================================================
    console.log('\n👨‍🔧 Seeding technicians...');
    const technicianQueries = [
      {
        sql: `INSERT INTO technicians (first_name, last_name, email, password, contact_number, specialization, service_area, account_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          'Rajesh',
          'Kumar',
          'rajesh@appliassist.com',
          'hashed_password',
          '555-0101',
          'Refrigerator,AC Repair',
          'Downtown, Midtown',
          'Approved',
        ],
      },
      {
        sql: `INSERT INTO technicians (first_name, last_name, email, password, contact_number, specialization, service_area, account_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          'Priya',
          'Sharma',
          'priya@appliassist.com',
          'hashed_password',
          '555-0102',
          'Washing Machine,Microwave',
          'All areas',
          'Approved',
        ],
      },
    ];

    for (const query of technicianQueries) {
      try {
        await executeQuery(query.sql, query.values);
        console.log(`  ✓ Technician: ${query.values[0]} ${query.values[1]}`);
      } catch (err) {
        // Skip if already exists
      }
    }

    // =========================================================================
    // SEED CUSTOMERS
    // =========================================================================
    console.log('\n👥 Seeding customers...');
    const customerQueries = [
      {
        sql: `INSERT INTO customers (first_name, last_name, email, password, contact_number, address, account_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        values: [
          'Amit',
          'Patel',
          'amit@example.com',
          'hashed_password',
          '555-0201',
          '100 Residential Lane',
          'Active',
        ],
      },
      {
        sql: `INSERT INTO customers (first_name, last_name, email, password, contact_number, address, account_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        values: [
          'Neha',
          'Gupta',
          'neha@example.com',
          'hashed_password',
          '555-0202',
          '200 Apartment Complex',
          'Active',
        ],
      },
    ];

    for (const query of customerQueries) {
      try {
        await executeQuery(query.sql, query.values);
        console.log(`  ✓ Customer: ${query.values[0]} ${query.values[1]}`);
      } catch (err) {
        // Skip if already exists
      }
    }

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   ✓ Store owners: 2');
    console.log('   ✓ Stores: 3');
    console.log('   ✓ Products: 8');
    console.log('   ✓ Services: 5');
    console.log('   ✓ Technicians: 2');
    console.log('   ✓ Customers: 2');
    console.log('\n🎉 Your database is ready for development!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error);
    console.error('\nTroubleshooting tips:');
    console.error('1. Ensure database is running');
    console.error('2. Check database connection in config/db.js');
    console.error('3. Verify tables exist (run schema.sql first)');
    console.error('4. Check for duplicate email constraints\n');
    process.exit(1);
  }
};

// Start seeding
seedDatabase();
