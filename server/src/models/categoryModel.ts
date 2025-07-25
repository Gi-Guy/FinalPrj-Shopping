import db from '../db';

export async function createCategory(
  name: string,
  slug: string,
  shopId: number,
  description = ''
) {
  const query = `
    INSERT INTO categories (name, slug, shop_id, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [name, slug, shopId, description];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function updateCategory(categoryId: number, name: string, description: string) {
  const query = `
    UPDATE categories
    SET name = $1, description = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [name, description, categoryId];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getCategoryBySlug(shopSlug: string, categorySlug: string) {
  const query = `
    SELECT c.*
    FROM categories c
    JOIN shops s ON s.id = c.shop_id
    WHERE s.slug = $1 AND c.slug = $2;
  `;
  const result = await db.query(query, [shopSlug, categorySlug]);
  return result.rows[0];
}

export async function getCategoryById(id: number) {
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getDefaultCategoryForShop(shopId: number) {
  const query = `
    SELECT * FROM categories
    WHERE shop_id = $1 AND slug = 'all';
  `;
  const result = await db.query(query, [shopId]);
  return result.rows[0];
}

export async function createDefaultCategory(shopId: number) {
  return await createCategory('All', 'all', shopId, 'Default category');
}

export async function reassignProductsToDefaultCategory(oldCategoryId: number, defaultCategoryId: number) {
  const query = `
    UPDATE products
    SET category_id = $1
    WHERE category_id = $2;
  `;
  await db.query(query, [defaultCategoryId, oldCategoryId]);
}

export async function deleteCategory(categoryId: number) {
  await db.query('DELETE FROM categories WHERE id = $1', [categoryId]);
}
