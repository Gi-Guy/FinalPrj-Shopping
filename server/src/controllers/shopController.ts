import { Request, Response } from 'express';
import {
  createShop,
  findShopBySlug,
  updateShopById,
  deleteShopById,
  toggleShopStatusById,
  updateShopHoursById
} from '../models/shopModel';

import {
  findUserById,
  updateUserById
} from '../models/userModel';

import { createDefaultCategory } from '../models/categoryModel';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

export async function handleCreateShop(req: AuthenticatedRequest, res: Response) {
  const { name, description, location, workingHours } = req.body;
  const ownerId = req.user?.id; // retrieved from JWT

  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Missing name or ownerId' });
  }

  try {
    const user = await findUserById(ownerId);
    if (!user) {
      return res.status(404).json({ error: 'Owner user not found' });
    }

    const slug = generateSlug(name);
    const existing = await findShopBySlug(slug);
    if (existing) {
      return res.status(409).json({ error: 'Shop with this name/slug already exists' });
    }

    const newShop = await createShop(name, description, slug, ownerId, location, workingHours);

    await updateUserById(ownerId, {
      shop_id: newShop.id,
      is_seller: true
    });

    await createDefaultCategory(newShop.id);

    res.status(201).json(newShop);
  } catch (err) {
    console.error('Error creating shop:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
