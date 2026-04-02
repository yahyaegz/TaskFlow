const pool = require('../../db/pool.js');

async function logActivity(userId, taskId, action, details = {}) {
  const query = `
    INSERT INTO activity_logs (user_id, task_id, action, details)
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(query, [userId, taskId, action, JSON.stringify(details)]);
}

async function getActivities(userId, limit = 20) {
  const query = `
    SELECT al.*, t.title as task_title
    FROM activity_logs al
    LEFT JOIN tasks t ON al.task_id = t.id
    WHERE al.user_id = $1
    ORDER BY al.created_at DESC
    LIMIT $2
  `;
  const { rows } = await pool.query(query, [userId, limit]);
  return rows;
}

module.exports = {
  logActivity,
  getActivities
};
