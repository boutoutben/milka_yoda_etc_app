import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.HOST);
const mysql = mysql2.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
});

export default mysql;