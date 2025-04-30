const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

// Create table query for api_keys
const createApiKeyTableQuery = `
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

// Initialize the table on module load
(async () => {
  try {
    await pool.query(createApiKeyTableQuery);
  } catch (err) {
    console.error('Error creating api_keys table:', err);
  }
})();

// Insert or update API key by key_name
async function upsertApiKey(keyName, apiKey) {
  const query = `
    INSERT INTO api_keys (key_name, api_key, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    ON CONFLICT (key_name)
    DO UPDATE SET api_key = EXCLUDED.api_key, updated_at = NOW()
    RETURNING *;
  `;
  const values = [keyName, apiKey];
  const res = await pool.query(query, values);
  return res.rows[0];
}

// Get API key by key_name
async function getApiKey(keyName) {
  const query = 'SELECT api_key FROM api_keys WHERE key_name = $1 LIMIT 1';
  const res = await pool.query(query, [keyName]);
  return res.rows.length > 0 ? res.rows[0].api_key : null;
}

module.exports = {
  upsertApiKey,
  getApiKey,
};
