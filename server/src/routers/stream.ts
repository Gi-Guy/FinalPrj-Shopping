import express from 'express';
import { StreamChat } from 'stream-chat';

const router = express.Router();

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const chatServerClient = StreamChat.getInstance(apiKey, apiSecret);

router.post('/token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const token = chatServerClient.createToken(userId);
  return res.json({ token });
});

export default router;
