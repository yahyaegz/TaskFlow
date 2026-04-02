const pool = require('../../db/pool.js');

function mapTag(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
  };
}

async function findAll(userId) {
  const { rows } = await pool.query('SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC', [userId]);
  return rows.map(mapTag);
}

async function create(userId, data) {
  const { rows } = await pool.query(
    'INSERT INTO tags (user_id, name, color) VALUES ($1, $2, $3) RETURNING *',
    [userId, data.name, data.color || '#ef4444']
  );
  return mapTag(rows[0]);
}

async function remove(userId, id) {
  const { rowCount } = await pool.query('DELETE FROM tags WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount > 0;
}

async function getTaskTags(taskId) {
  const { rows } = await pool.query(`
    SELECT t.* FROM tags t
    JOIN task_tags tt ON t.id = tt.tag_id
    WHERE tt.task_id = $1
  `, [taskId]);
  return rows.map(mapTag);
}

async function updateTaskTags(taskId, tagIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM task_tags WHERE task_id = $1', [taskId]);
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await client.query('INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)', [taskId, tagId]);
      }
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  findAll,
  create,
  remove,
  getTaskTags,
  updateTaskTags,
};
