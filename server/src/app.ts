import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.send({ status: 'OK' });
});

//TESITNG ONLY
app.get('/api/ping', (_, res) => {
  res.json({ message: 'Backend is connected ✅' });
});

export default app;