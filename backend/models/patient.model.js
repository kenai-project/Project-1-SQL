const createPatientTableQuery = `
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function createTable(pgPool) {
  await pgPool.query(createPatientTableQuery);
}

async function getAllPatients(pgPool) {
  const res = await pgPool.query('SELECT * FROM patients ORDER BY id ASC');
  return res.rows;
}

async function getPatientById(pgPool, id) {
  const res = await pgPool.query('SELECT * FROM patients WHERE id = $1', [id]);
  return res.rows[0];
}

async function createPatient(pgPool, patient) {
  const { first_name, last_name, date_of_birth, gender, address, phone, email } = patient;
  const res = await pgPool.query(
    `INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [first_name, last_name, date_of_birth, gender, address, phone, email]
  );
  return res.rows[0];
}

async function updatePatient(pgPool, id, patient) {
  const { first_name, last_name, date_of_birth, gender, address, phone, email } = patient;
  const res = await pgPool.query(
    `UPDATE patients SET first_name=$1, last_name=$2, date_of_birth=$3, gender=$4, address=$5, phone=$6, email=$7, updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [first_name, last_name, date_of_birth, gender, address, phone, email, id]
  );
  return res.rows[0];
}

async function deletePatient(pgPool, id) {
  await pgPool.query('DELETE FROM patients WHERE id = $1', [id]);
}

module.exports = {
  createTable,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
