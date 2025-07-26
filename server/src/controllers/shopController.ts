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
  console.log('Hey im here:', req.body);
  const { name, description, location, workingHours } = req.body;
  const ownerId = req.user?.id;

  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Missing name or ownerId' });
  }

  const user = await findUserById(ownerId);
  if (!user) {
    return res.status(404).json({ error: 'Owner user not found' });
  }

  const slug = generateSlug(name);
  const existing = await findShopBySlug(slug);
  if (existing) {
    return res.status(409).json({ error: 'Shop with this name/slug already exists' });
  }

  try {
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

export async function handleUpdateShop(req: Request, res: Response) {
  const { slug } = req.params;
  const { name, description, location } = req.body;

  try {
    const shop = await findShopBySlug(slug);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const updated = await updateShopById(shop.id, { name, description, location });
    res.json(updated);
  } catch (err) {
    console.error('Error updating shop:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleDeleteShop(req: Request, res: Response) {
  const { slug } = req.params;

  try {
    const shop = await findShopBySlug(slug);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    await deleteShopById(shop.id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting shop:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleToggleShopStatus(req: Request, res: Response) {
  const { slug } = req.params;

  try {
    const shop = await findShopBySlug(slug);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const updated = await toggleShopStatusById(shop.id);
    res.json(updated);
  } catch (err) {
    console.error('Error toggling shop status:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleUpdateShopHours(req: Request, res: Response) {
  const { slug } = req.params;
  const { workingHours } = req.body;

  try {
    const shop = await findShopBySlug(slug);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const updated = await updateShopHoursById(shop.id, workingHours);
    res.json(updated);
  } catch (err) {
    console.error('Error updating shop hours:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
