import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
  ssl: process.env.PG_SSL === 'true'
});

export default pool;