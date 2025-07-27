import express from 'express';
import dotenv from 'dotenv';
import pool from './db';
import app from './app';
import streamRoutes from './routers/stream';


dotenv.config({ path: './src/.env' });

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use('/api/stream', streamRoutes);

async function startServer() {
  try {
    await pool.query('SELECT 1'); 
    console.log('🟢 Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌍 Stream routes active at /api/stream`);
    });
  } catch (error) {
    console.error('🔴 Failed to connect to DB:', error);
    process.exit(1);
  }
}

startServer();
