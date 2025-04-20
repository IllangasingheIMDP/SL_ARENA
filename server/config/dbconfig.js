require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

// Read the SSL certificate
const ca = fs.readFileSync(process.env.SSL_CA_PATH);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  
  ssl: {
    ca: ca
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
