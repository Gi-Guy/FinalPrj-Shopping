import { Request, Response } from 'express';
import {
  createProduct,
  getProductById,
  getProductsByShop,
  getProductsByCategory,
  updateProductDetails,
  updateProductStock,
  deactivateProduct,
  deleteProduct
} from '../models/productModel';

import { findShopBySlug, findShopById } from '../models/shopModel';
import { getDefaultCategoryForShop, getCategoryById } from '../models/categoryModel';

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}
export async function handleCreateProductByShopId(req: Request, res: Response) {
  console.log('Creating product by shop ID');
  const {
    name,
    description,
    image_url,
    price,
    stock_quantity,
    shop_id,
    category_id,
    seller_id
  } = req.body;

  if (!name || !price || !shop_id || !category_id || !seller_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const shop = await findShopById(shop_id);
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  const category = await getCategoryById(category_id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const slug = generateSlug(name);

  try {
    const product = await createProduct({
      name,
      description,
      image_url,
      price,
      stock_quantity,
      slug,
      shop_id,
      category_id,
      seller_id
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function handleCreateProduct(req: Request, res: Response) {
  console.log('Creating product for shop slug');
  const { shopSlug } = req.params;
  const {
    name,
    description,
    image_url,
    price,
    stock_quantity,
    category_id,
    seller_id
  } = req.body;

  try {
    const shop = await findShopBySlug(shopSlug);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    const finalCategoryId =
      category_id || (await getDefaultCategoryForShop(shop.id))?.id;

    const slug = generateSlug(name);

    const product = await createProduct({
      name,
      description,
      image_url,
      price,
      stock_quantity,
      slug,
      shop_id: shop.id,
      category_id: finalCategoryId,
      seller_id
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleUpdateProductDetails(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await updateProductDetails(Number(id), updates);
    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleUpdateProductStock(req: Request, res: Response) {
  const { id } = req.params;
  const { stock_quantity } = req.body;

  try {
    const updated = await updateProductStock(Number(id), stock_quantity);
    res.json(updated);
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleDeleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await deleteProduct(Number(id));
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleDeactivateProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await deactivateProduct(Number(id));
    res.json(result);
  } catch (err) {
    console.error('Error deactivating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleGetProductsByShop(req: Request, res: Response) {
  const { shopSlug } = req.params;

  try {
    const shop = await findShopBySlug(shopSlug);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    const products = await getProductsByShop(shop.id);
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function handleGetProductsByCategory(req: Request, res: Response) {
  const { categoryId } = req.params;

  try {
    const products = await getProductsByCategory(Number(categoryId));
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
