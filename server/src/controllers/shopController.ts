import { Request, Response } from 'express';
import {
  createShop,
  findShopBySlug,
  updateShopById,
  deleteShopById,
  toggleShopStatusById,
  updateShopHoursById
} from '../models/shopModel';

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

export async function handleCreateShop(req: Request, res: Response) {
  const { name, description, ownerId, location, workingHours } = req.body;

  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Missing name or ownerId' });
  }

  const slug = generateSlug(name);
  const existing = await findShopBySlug(slug);
  if (existing) {
    return res.status(409).json({ error: 'Shop with this name/slug already exists' });
  }

  try {
    const newShop = await createShop(name, description, slug, ownerId, location, workingHours);
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