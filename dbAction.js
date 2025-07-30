const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.test' });

const db = mysql.createPool({
  host: process.env.TEST_HOST,
  port: process.env.TEST_DB_PORT || 3306,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function findUserByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", email);
    return rows[0];
}

async function deleteUserByEmail(email) {
  await db.query("DELETE FROM users WHERE email = ?", [email]);
}

async function findByField(table, field, fieldValue) {
  const [actions] = await db.query(`select * from \`${table}\` where \`${field}\` = ?`, [fieldValue]); 
  return actions[0]||null
}

async function resetDescriptAfterUpdate(table, field, fieldValue, description) {
  const query = `UPDATE \`${table}\` SET \`description\` = ? WHERE \`${field}\` = ?`;
  return db.query(query, [description, fieldValue]);
}

async function deleteByField(table, field, fieldValue) {
  db.query(
    `DELETE FROM \`${table}\` WHERE \`${field}\` = ?`, [fieldValue]
  )
}

async function clearUserPersonneldata(email) {
  db.query(`UPDATE users SET civility = null, age=null, adressePostale=null WHERE email = ?`, [email])
}

async function updateAdoptAnimalStatus(id, value) {
  db.query("UPDATE animals SET isAdopted=? WHERE id=?", [value, id])
}

module.exports = {
    findUserByEmail,
    deleteUserByEmail,
    findByField,
    resetDescriptAfterUpdate,
    deleteByField,
    updateAdoptAnimalStatus,
    clearUserPersonneldata
}