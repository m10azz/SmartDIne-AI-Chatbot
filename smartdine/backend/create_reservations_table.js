const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sql = `
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);
`;

async function run() {
  try {
    await pool.query(sql);
    console.log('Reservations table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await pool.end();
  }
}
run();
