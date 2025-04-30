const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

// Function to insert FHIR data into PostgreSQL
async function insertFhirRecord(data) {
  const query = 'INSERT INTO fhir_records(data, created_at, updated_at) VALUES($1, NOW(), NOW()) RETURNING *';
  const values = [data];
  const res = await pool.query(query, values);
  return res.rows[0];
}

// Function to get FHIR records (example)
async function getFhirRecords() {
  const query = 'SELECT * FROM fhir_records ORDER BY created_at DESC';
  const res = await pool.query(query);
  return res.rows;
}

// Function to delete FHIR record by id
async function deleteFhirRecord(id) {
  const query = 'DELETE FROM fhir_records WHERE id = $1';
  await pool.query(query, [id]);
}

module.exports = {
  insertFhirRecord,
  getFhirRecords,
  deleteFhirRecord,
};
