const pool = require('../../db/pool.js');

async function getPredictedCompletionTime(userId, priority) {
  const query = `
    SELECT 
      AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) / 3600 as avg_hours
    FROM tasks 
    WHERE user_id = $1 AND completed = true AND priority = $2
    AND completed_at IS NOT NULL
  `;

  const { rows } = await pool.query(query, [userId, priority]);
  const avgHours = rows[0].avg_hours;

  if (!avgHours) return null;

  if (avgHours < 1) {
    return `${Math.round(avgHours * 60)} minutes`;
  } else if (avgHours < 24) {
    return `${Math.round(avgHours)} hours`;
  } else {
    return `${Math.round(avgHours / 24)} days`;
  }
}

module.exports = {
  getPredictedCompletionTime
};
