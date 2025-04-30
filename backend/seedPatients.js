require("dotenv").config();
const { Pool } = require("pg");

const pgPool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

const dummyPatients = [
  {
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1980-01-15",
    gender: "Male",
    address: "123 Main St, Springfield",
    phone: "555-1234",
    email: "john.doe@example.com",
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    date_of_birth: "1990-05-22",
    gender: "Female",
    address: "456 Elm St, Springfield",
    phone: "555-5678",
    email: "jane.smith@example.com",
  },
  {
    first_name: "Alice",
    last_name: "Johnson",
    date_of_birth: "1975-09-10",
    gender: "Female",
    address: "789 Oak St, Springfield",
    phone: "555-9012",
    email: "alice.johnson@example.com",
  },
];

async function seed() {
  try {
    // Create patients table if not exists
    await pgPool.query(`
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
    `);

    // Insert dummy patients
    for (const patient of dummyPatients) {
      await pgPool.query(
        'INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
        'ON CONFLICT DO NOTHING;',
        [
          patient.first_name,
          patient.last_name,
          patient.date_of_birth,
          patient.gender,
          patient.address,
          patient.phone,
          patient.email,
        ]
      );
    }

    console.log("✅ Dummy patients seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding dummy patients:", error);
  } finally {
    await pgPool.end();
  }
}

seed();
