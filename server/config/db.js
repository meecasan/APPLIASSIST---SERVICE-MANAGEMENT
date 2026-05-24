require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Appliassist123_',
    database: process.env.DB_NAME || 'appliassist',
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.log('Database connection failed');
        console.log(err);
    } else {
        console.log('MySQL Connected');
    }
});

module.exports = connection;