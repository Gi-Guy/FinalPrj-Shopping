import db from '../db';

export interface CreateProductInput {
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  stock_quantity?: number;
  slug: string;
  shop_id: number;
  category_id: number;
  seller_id: number;
}

export async function createProduct(product: CreateProductInput) {
  const {
    name, description, image_url, price,
    stock_quantity = 0, slug, shop_id, category_id, seller_id
  } = product;

  const result = await db.query(
    `INSERT INTO products
     (name, description, image_url, price, stock_quantity, is_active, slug,
      shop_id, category_id, seller_id)
     VALUES ($1, $2, $3, $4, $5, TRUE, $6, $7, $8, $9)
     RETURNING *`,
    [name, description, image_url, price, stock_quantity, slug, shop_id, category_id, seller_id]
  );

  return result.rows[0];
}

export async function getProductById(id: number) {
  const result = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return result.rows[0];
}

export async function getProductsByShop(shopId: number) {
  const result = await db.query(
    `SELECT * FROM products WHERE shop_id = $1 AND is_active = TRUE`,
    [shopId]
  );
  return result.rows;
}

export async function updateProductStock(id: number, quantity: number) {
  const result = await db.query(
    `UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [quantity, id]
  );
  return result.rows[0];
}

export async function deactivateProduct(id: number) {
  const result = await db.query(
    `UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function deleteProduct(id: number) {
  await db.query(`DELETE FROM products WHERE id = $1`, [id]);
}
export async function updateProductDetails(
  id: number,
  updates: {
    name?: string;
    description?: string;
    image_url?: string;
    price?: number;
    category_id?: number;
  }
) {
  const keys = Object.keys(updates);
  if (!keys.length) return getProductById(id);

  const values = Object.values(updates);
  const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');

  const result = await db.query(
    `UPDATE products
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${keys.length + 1}
     RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}
export async function getProductsByCategory(categoryId: number) {
  const result = await db.query(
    `SELECT * FROM products WHERE category_id = $1 AND is_active = TRUE`,
    [categoryId]
  );
  return result.rows;
}