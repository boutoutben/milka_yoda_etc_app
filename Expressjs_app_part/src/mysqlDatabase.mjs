import mysql2 from 'mysql2';

const mysql = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:'Cpvupvu123!',
    database:'milka_yoda_etc'
});

export default mysql;