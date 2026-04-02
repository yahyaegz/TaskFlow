const pool = require('../../db/pool.js');

function mapCategory(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
  };
}

async function findAll(userId) {
  const { rows } = await pool.query('SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC', [userId]);
  return rows.map(mapCategory);
}

async function create(userId, data) {
  const { rows } = await pool.query(
    'INSERT INTO categories (user_id, name, color) VALUES ($1, $2, $3) RETURNING *',
    [userId, data.name, data.color || '#8b5cf6']
  );
  return mapCategory(rows[0]);
}

async function update(userId, id, data) {
  const { rows } = await pool.query(
    'UPDATE categories SET name = $1, color = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [data.name, data.color, id, userId]
  );
  return rows[0] ? mapCategory(rows[0]) : null;
}

async function remove(userId, id) {
  const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount > 0;
}

module.exports = {
  findAll,
  create,
  update,
  remove,
};
