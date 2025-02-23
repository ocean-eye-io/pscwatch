// src/utils/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'database-1.c9aqym2caigt.us-east-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'Waterfire1',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // For development
    }
});

export const query = (text, params) => pool.query(text, params);

