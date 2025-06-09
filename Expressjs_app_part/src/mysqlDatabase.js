const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const mysql = mysql2.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
});

module.exports = mysql;