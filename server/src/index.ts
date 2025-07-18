import app from './app';
import pool from './db';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await pool.query('SELECT 1'); 
    console.log('🟢 Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Failed to connect to DB:', error);
    process.exit(1);
  }
}

startServer();