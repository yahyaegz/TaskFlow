const pool = require('../../db/pool.js');

async function create(comment) {
  const query = `
    INSERT INTO comments (task_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, task_id, user_id, content, created_at
  `;
  const values = [comment.taskId, comment.userId, comment.content];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByTaskId(taskId) {
  const query = `
    SELECT c.id, c.task_id, c.user_id, c.content, c.created_at, u.name as user_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.task_id = $1
    ORDER BY c.created_at ASC
  `;
  const { rows } = await pool.query(query, [taskId]);
  return rows;
}

async function deleteById(id) {
  const query = 'DELETE FROM comments WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  create,
  findByTaskId,
  deleteById,
};
