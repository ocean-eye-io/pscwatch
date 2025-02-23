// src/server/index.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.c9aqym2caigt.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'Waterfire1',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/api/vessels', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (imo_no)
        *
      FROM vessel_tracking
      ORDER BY imo_no, report_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});