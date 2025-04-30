const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

// Function to insert HL7 record into PostgreSQL
async function insertHL7Record(message, parsedData) {
  const query = 'INSERT INTO hl7_records(message, parsed_data, created_at) VALUES($1, $2, NOW()) RETURNING *';
  const values = [message, JSON.stringify(parsedData)];
  const res = await pool.query(query, values);
  return res.rows[0];
}

// Function to get HL7 records (example)
async function getHL7Records() {
  const query = 'SELECT * FROM hl7_records ORDER BY created_at DESC';
  const res = await pool.query(query);
  return res.rows;
}

// Function to delete HL7 record by id
async function deleteHL7Record(id) {
  const query = 'DELETE FROM hl7_records WHERE id = $1';
  await pool.query(query, [id]);
}

module.exports = {
  insertHL7Record,
  getHL7Records,
  deleteHL7Record,
};
