import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import {
  createUser,
  findUserById,
  updateUserById,
  toggleUserSellerStatus,
  updateLastLogin,
  deactivateUser,
  getShopByUserId,
  updateUserPassword
} from '../models/userModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function handleCreateUser(req: Request, res: Response) {
  const {
    username, email, first_name, last_name,
    password_hash, gender, phone
  } = req.body;

  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUser = await createUser({
      username,
      email,
      first_name,
      last_name,
      password_hash: hashedPassword,
      gender,
      phone
    });

    res.status(201).json(newUser);
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
export async function handleUpdateUserPassword(req: Request, res: Response) { 
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updateUserPassword(Number(id), hashedPassword);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user password:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
// export async function handleGetUserById(req: Request, res: Response) {
//   const { id } = req.params;

//   try {
//     const user = await findUserById(Number(id));
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     console.error('Error fetching user:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// }
export async function handleGetUserById(req: AuthenticatedRequest, res: Response) {
  console.log('req.user:', req.user);
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}