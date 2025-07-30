const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
console.log("NODE_ENV =", process.env.NODE_ENV);
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

const db = mysql.createPool({
  host: process.env.HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Ici on retourne l’objet promesse
module.exports = db.promise(); 