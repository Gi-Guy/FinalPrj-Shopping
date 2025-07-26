import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in .env');

export interface AuthenticatedRequest extends Request {
  user?: { id: number }; // use `id` to match your controller logic
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  console.log('Authorization Header:', req.headers.authorization);
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.user = { id: decoded.userId }; // rename to `id` for consistency
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}
