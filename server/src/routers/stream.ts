import { Router, Request, Response } from 'express';
import { StreamChat } from 'stream-chat';

const router = Router();

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

router.post('/token', (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const token = serverClient.createToken(userId);
  return res.json({ token });
});

export default router;
