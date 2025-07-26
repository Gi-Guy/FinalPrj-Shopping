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
  const ownerId = req.user?.id;

  if (!name) {
    return res.status(400).json({ error: 'Missing shop name' });
  }
  if (!ownerId) {
    return res.status(401).json({ error: 'Unauthorized: Missing user ID from token' });
  }

  try {
    // Validate owner exists
    const user = await findUserById(ownerId);
    if (!user) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Generate unique slug
    const slug = generateSlug(name);
    const existingShop = await findShopBySlug(slug);
    if (existingShop) {
      return res.status(409).json({ error: 'Shop with this name already exists' });
    }

    // Create shop
    const newShop = await createShop(name, description, slug, ownerId, location, workingHours);

    // Mark user as seller
    await updateUserById(ownerId, {
      shop_id: newShop.id,
      is_seller: true
    });

    // Add default category to shop
    await createDefaultCategory(newShop.id);

    return res.status(201).json(newShop);
  } catch (error) {
    console.error('Error creating shop:', error);
    return res.status(500).json({ error: 'Failed to create shop' });
  }
}
