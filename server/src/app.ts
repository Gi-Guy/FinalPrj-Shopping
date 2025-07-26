import express from 'express';
import cors from 'cors';
import path from 'path';
import pool from './db';

// Routes
import shopRoutes from './routers/shops';
import categoryRoutes from './routers/categories';
import userRoutes from './routers/users';
import productRoutes from './routers/products';
import messageRoutes from './routers/messages';
import authRoutes from './routers/auth';
import uploadRoutes from './routers/upload';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/pictures', express.static(path.join(__dirname, '../pictures')));

// API Routes
app.use('/api/shops', shopRoutes);           // ✅ includes handleCreateShop
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Remove duplicate product route
// app.use('/api/products', productRoutes); // ❌ Already declared above

// Health Check
app.get('/api/health', (_, res) => {
  res.send({ status: 'OK' });
});

// Simple Ping
app.get('/api/ping', (_, res) => {
  res.json({ message: 'Backend is connected ✅' });
});

// Get user by ID (🔍 Individual query - may be temporary in future)
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

// Update user by ID (🔧 Could be moved into userRoutes)
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
