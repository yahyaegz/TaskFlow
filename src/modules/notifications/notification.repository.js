const pool = require('../../db/pool.js');

async function getNotifications(userId, { unreadOnly, limit = 50 }) {
  let query = 'SELECT * FROM notifications WHERE user_id = $1';
  const params = [userId];

  if (unreadOnly) {
    query += ' AND read = false';
  }

  query += ' ORDER BY created_at DESC LIMIT $2';
  params.push(limit);

  const { rows } = await pool.query(query, params);
  return rows;
}

async function markAsRead(userId, notificationId) {
  const { rows } = await pool.query(
    'UPDATE notifications SET read = true WHERE user_id = $1 AND id = $2 RETURNING *',
    [userId, notificationId]
  );
  return rows[0];
}

async function markAllAsRead(userId) {
  await pool.query('UPDATE notifications SET read = true WHERE user_id = $1', [userId]);
}

async function createNotification(userId, { type, title, message, link }) {
  const { rows } = await pool.query(
    'INSERT INTO notifications (user_id, type, title, message, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, type, title, message, link]
  );
  return rows[0];
}

async function deleteAllNotifications(userId) {
  await pool.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteAllNotifications,
};
