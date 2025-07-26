import { Request, Response } from 'express';
import {
  createCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getDefaultCategoryForShop,
  reassignProductsToDefaultCategory,
  getCategoriesByShopSlug
} from '../models/categoryModel';
import { findShopBySlug } from '../models/shopModel';

export async function handleCreateCategory(req: Request, res: Response) {
  const { name, slug, description, shopSlug } = req.body;
  if (!name || !slug || !shopSlug) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const shop = await findShopBySlug(shopSlug);
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  try {
    const category = await createCategory(name, slug, shop.id, description);
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleGetCategory(req: Request, res: Response) {
  const { shopSlug, categorySlug } = req.params;

  try {
    const category = await getCategoryBySlug(shopSlug, categorySlug);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleUpdateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await getCategoryById(Number(id));
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updated = await updateCategory(category.id, name, description);
    res.json(updated);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleDeleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const category = await getCategoryById(Number(id));
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const defaultCategory = await getDefaultCategoryForShop(category.shop_id);
    if (!defaultCategory) {
      return res.status(500).json({ error: 'Default category not found' });
    }

    await reassignProductsToDefaultCategory(category.id, defaultCategory.id);
    await deleteCategory(category.id);

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function handleGetCategoriesByShop(req: Request, res: Response) {
  const { shopSlug } = req.params;

  try {
    const categories = await getCategoriesByShopSlug(shopSlug);
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories by shop slug:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
