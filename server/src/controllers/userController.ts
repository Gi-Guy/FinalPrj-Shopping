import { Request, Response } from 'express';
import {
  createUser,
  findUserById,
  updateUserById,
  toggleUserSellerStatus,
  updateLastLogin,
  deactivateUser,
  getShopByUserId 
} from '../models/userModel';

export async function handleCreateUser(req: Request, res: Response) {
  const {
    username, email, first_name, last_name,
    password_hash, gender, phone, shop_id
  } = req.body;

  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await createUser({
      username, email, first_name, last_name,
      password_hash, gender, phone, shop_id
    });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleUpdateUser(req: Request, res: Response) {
  const { id } = req.params;
  const {
    username, email, first_name, last_name,
    gender, phone, shop_id
  } = req.body;

  try {
    const user = await findUserById(Number(id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await updateUserById(Number(id), {
      username, email, first_name, last_name, gender, phone, shop_id
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleToggleSellerStatus(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const updated = await toggleUserSellerStatus(Number(id));
    res.json(updated);
  } catch (err) {
    console.error('Error toggling seller status:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleUpdateLastLogin(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const updated = await updateLastLogin(Number(id));
    res.json(updated);
  } catch (err) {
    console.error('Error updating login time:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleDeactivateUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await deactivateUser(Number(id));
    res.status(204).send();
  } catch (err) {
    console.error('Error deactivating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function handleGetShopByUserId(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const shop = await getShopByUserId(Number(id));
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found for this user' });
    }

    res.json(shop);
  } catch (err) {
    console.error('Error fetching shop by user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function handleDeleteUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await findUserById(Number(id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    await deactivateUser(Number(id));
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}