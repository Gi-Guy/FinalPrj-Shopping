import pool from '../db';

export async function createShop(
  name: string,
  description: string,
  slug: string,
  ownerId: number,
  location: string,
  workingHours: string
) {
  const result = await pool.query(
    `INSERT INTO shops (name, description, slug, owner_id, location, working_hours)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, slug, ownerId, location, workingHours]
  );
  return result.rows[0];
}

export async function findShopBySlug(slug: string) {
  const result = await pool.query(
    `SELECT * FROM shops WHERE slug = $1`,
    [slug]
  );
  return result.rows[0];
}

export async function updateShopById(
  id: number,
  updates: { name?: string; description?: string; location?: string }
) {
  const { name, description, location } = updates;
  const result = await pool.query(
    `UPDATE shops
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         location = COALESCE($3, location)
     WHERE id = $4
     RETURNING *`,
    [name, description, location, id]
  );
  return result.rows[0];
}

export async function deleteShopById(id: number) {
  await pool.query(`DELETE FROM shops WHERE id = $1`, [id]);
}

export async function toggleShopStatusById(id: number) {
  const result = await pool.query(
    `UPDATE shops
     SET is_active = NOT is_active
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function updateShopHoursById(id: number, workingHours: string) {
  const result = await pool.query(
    `UPDATE shops
     SET working_hours = $1
     WHERE id = $2
     RETURNING *`,
    [workingHours, id]
  );
  return result.rows[0];
}
