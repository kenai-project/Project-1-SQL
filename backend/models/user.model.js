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

async function updateUser(pgPool, id, user) {
  const { username, email, profileImage } = user;
  const res = await pgPool.query(
    "UPDATE users SET username = $1, email = $2, profile_image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, profile_image",
    [username, email, profileImage, id]
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
      profile_image VARCHAR(255),
      refresh_token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function saveRefreshToken(pgPool, userId, refreshToken) {
  await pgPool.query(
    "UPDATE users SET refresh_token = $1 WHERE id = $2",
    [refreshToken, userId]
  );
}

async function findUserByRefreshToken(pgPool, refreshToken) {
  const res = await pgPool.query(
    "SELECT id, username, email FROM users WHERE refresh_token = $1",
    [refreshToken]
  );
  return res.rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  createUsersTable,
  saveRefreshToken,
  findUserByRefreshToken,
};
