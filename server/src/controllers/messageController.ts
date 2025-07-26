import { Request, Response } from 'express';
import { sendMessage, getMessagesBetweenUsers } from '../models/messageModel';

export async function handleSendMessage(req: Request, res: Response) {
  const { senderId, receiverId, content } = req.body;
  if (!content || !senderId || !receiverId) return res.status(400).json({ error: 'Missing fields' });

  const message = await sendMessage(senderId, receiverId, content);
  res.status(201).json(message);
}

export async function handleGetMessages(req: Request, res: Response) {
  const { user1, user2 } = req.params;
  const messages = await getMessagesBetweenUsers(Number(user1), Number(user2));
  res.json(messages);
}
