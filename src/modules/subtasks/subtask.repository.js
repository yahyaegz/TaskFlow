const pool = require('../../db/pool.js');

function mapSubtask(row) {
  return {
    id: row.id,
    taskId: row.task_id,
    title: row.title,
    completed: row.completed,
    position: row.position,
  };
}

async function findByTaskId(taskId) {
  const { rows } = await pool.query('SELECT * FROM subtasks WHERE task_id = $1 ORDER BY position ASC', [taskId]);
  return rows.map(mapSubtask);
}

async function create(taskId, data) {
  const { rows } = await pool.query(
    'INSERT INTO subtasks (task_id, title, position) VALUES ($1, $2, (SELECT COALESCE(MAX(position), -1) + 1 FROM subtasks WHERE task_id = $3)) RETURNING *',
    [taskId, data.title, taskId]
  );
  return mapSubtask(rows[0]);
}

async function update(id, data) {
  const fields = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(data, 'title')) {
    values.push(data.title);
    fields.push(`title = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'completed')) {
    values.push(data.completed);
    fields.push(`completed = $${values.length}`);
  }

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE subtasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] ? mapSubtask(rows[0]) : null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM subtasks WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  findByTaskId,
  create,
  update,
  remove,
};
