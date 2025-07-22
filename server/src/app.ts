import express from 'express';
import cors from 'cors';
import pool from './db'; // make sure this exports your pg Pool instance
import shopRoutes from './routers/shops';
import categoryRoutes from './routers/categories';
import userRoutes from './routers/users';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/shops', shopRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
// health check endpoint for testing only
app.get('/api/health', (_, res) => {
  res.send({ status: 'OK' });
});

// Testing endpoint
app.get('/api/ping', (_, res) => {
  res.json({ message: 'Backend is connected ✅' });
});

// ✅ Get user by ID
app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ✅ Update user by ID
app.put('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, location, bio, avatar } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           location = $3,
           bio = $4,
           avatar = $5
       WHERE id = $6
       RETURNING *`,
      [name, email, location, bio, avatar, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or not updated' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default app;
