import express from 'express';
import cors from 'cors';
import shopRoutes from './routers/shops';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/shops', shopRoutes);

app.get('/api/health', (_, res) => {
  res.send({ status: 'OK' });
});

//TESITNG ONLY
app.get('/api/ping', (_, res) => {
  res.json({ message: 'Backend is connected ✅' });
});

export default app;