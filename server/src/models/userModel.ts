import db from '../db';

interface CreateUserInput {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  gender?: string;
  phone?: string;
  shop_id?: number | null;
  is_seller?: boolean | false;
}

interface UpdateUserInput {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  phone?: string;
  shop_id?: number | null;
  is_seller?: boolean;
}

export async function createUser(user: CreateUserInput) {
  const {
    username, email, first_name, last_name,
    password_hash, gender, phone, shop_id, is_seller
  } = user;

  const result = await db.query(
    `INSERT INTO users
     (username, email, first_name, last_name, password_hash, gender, phone, shop_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [username, email, first_name, last_name, password_hash, gender, phone, shop_id, is_seller]
  );

  return result.rows[0];
}

export async function findUserById(id: number) {
  const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function updateUserById(id: number, fields: UpdateUserInput) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (!keys.length) return findUserById(id);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await db.query(
    `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}

export async function toggleUserSellerStatus(id: number) {
  const result = await db.query(
    `UPDATE users SET is_seller = NOT is_seller WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function updateLastLogin(id: number) {
  const result = await db.query(
    `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function deactivateUser(id: number) {
  await db.query(
    `UPDATE users SET is_active = FALSE WHERE id = $1`,
    [id]
  );
}
export async function getShopByUserId(userId: number) {
  const result = await db.query(
    `SELECT shops.* 
     FROM users 
     JOIN shops ON users.shop_id = shops.id 
     WHERE users.id = $1`,
    [userId]
  );

  return result.rows[0] || null;
}
export async function updateUserShopStatus(userId: number, shopId: number, isSeller: boolean) {
  const result = await db.query(
    `UPDATE users 
     SET shop_id = $1, is_seller = $2 
     WHERE id = $3 
     RETURNING *`,
    [shopId, isSeller, userId]
  );
  return result.rows[0];
}
// update password 
export async function updateUserPassword(userId: number, newPassword: string) {
  const result = await db.query(
    `UPDATE users 
     SET password_hash = $1 
     WHERE id = $2 
     RETURNING *`,
    [newPassword, userId]
  );
  return result.rows[0];
}

export async function findUserByUsername(username: string) {
  const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return result.rows[0] || null;
}   