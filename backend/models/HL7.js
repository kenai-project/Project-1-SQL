const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

// Function to insert HL7 data into PostgreSQL
async function insertHL7Record(rawMessage, parsedData) {
  const query = 'INSERT INTO hl7_records(raw_message, parsed_data, timestamp) VALUES($1, $2, NOW()) RETURNING *';
  const values = [rawMessage, parsedData];
  const res = await pool.query(query, values);
  return res.rows[0];
}

// Function to get HL7 records (example)
async function getHL7Records() {
  const query = 'SELECT * FROM hl7_records ORDER BY timestamp DESC';
  const res = await pool.query(query);
  return res.rows;
}

module.exports = {
  insertHL7Record,
  getHL7Records,
};
