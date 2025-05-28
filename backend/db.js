const { Pool } = require('pg');

if (!process.env.PG_CONNECTION_STRING) {
  console.error("❌ PG_CONNECTION_STRING is not defined in environment variables.");
  process.exit(1);
}

const pgPool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

pgPool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

module.exports = pgPool;
