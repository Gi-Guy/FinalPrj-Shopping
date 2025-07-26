import { Request, Response } from 'express';
import { createUser, findUserByUsername } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in .env');

export async function handleRegister(req: Request, res: Response) {
  try {
    const {
      username,
      email,
      first_name,
      last_name,
      password_hash,
      gender,
      phone,
      is_seller
    } = req.body;

    const existing = await findUserByUsername(username);
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password_hash, 10);
    console.log('❌❌ Payload received in register:', req.body);
    
    const user = await createUser({
      username,
      email,
      first_name,
      last_name,
      password_hash: hashedPassword,
      gender,
      phone,
      is_seller
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, { expiresIn: '24h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
}
export async function handleLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, { expiresIn: '24h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
}
