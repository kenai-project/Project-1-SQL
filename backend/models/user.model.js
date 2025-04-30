const bcrypt = require("bcryptjs");

async function findUserByEmail(pgPool, email) {
  const res = await pgPool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
}

async function findUserById(pgPool, id) {
  const res = await pgPool.query("SELECT id, username, email FROM users WHERE id = $1", [id]);
  return res.rows[0];
}

async function createUser(pgPool, user) {
  const { username, email, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pgPool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
    [username, email, hashedPassword]
  );
  return res.rows[0];
}

async function createUsersTable(pgPool) {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  createUsersTable,
};
