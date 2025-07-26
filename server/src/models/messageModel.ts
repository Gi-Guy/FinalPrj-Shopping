import db from '../db';

export async function sendMessage(senderId: number, receiverId: number, content: string) {
  const result = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [senderId, receiverId, content]
  );
  return result.rows[0];
}

export async function getMessagesBetweenUsers(user1Id: number, user2Id: number) {
  const result = await db.query(
    `SELECT * FROM messages 
     WHERE (sender_id = $1 AND receiver_id = $2) 
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [user1Id, user2Id]
  );
  return result.rows;
}
