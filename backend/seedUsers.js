require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pgPool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

const dummyUsers = [
  {
    username: "doctor1",
    email: "doctor1@example.com",
    password: "Doctor1@123",
  },
  {
    username: "doctor2",
    email: "doctor2@example.com",
    password: "Doctor2@123",
  },
];

async function seed() {
  try {
    // Create users table if not exists
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

    // Insert dummy users
    for (const user of dummyUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pgPool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING;',
        [user.username, user.email, hashedPassword]
      );
    }

    console.log("✅ Dummy users seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding dummy users:", error);
  } finally {
    await pgPool.end();
  }
}

seed();
