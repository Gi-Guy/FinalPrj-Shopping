import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pg from 'pg';

dotenv.config({ path: './env/.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
  ssl: process.env.PG_SSL === 'true',
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL DB'))
  .catch(err => console.error('DB connection error:', err));

app.get('/', (_, res) => {
  res.send('Server running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
