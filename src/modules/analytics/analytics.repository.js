const pool = require('../../db/pool.js');

async function getProductivityStats(userId) {
  // Get completions per day for last 14 days
  const query = `
    WITH days AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '13 days',
        CURRENT_DATE,
        '1 day'::interval
      )::date AS day
    )
    SELECT 
      d.day,
      COUNT(t.id)::int as count
    FROM days d
    LEFT JOIN tasks t ON DATE(t.completed_at) = d.day AND t.user_id = $1
    GROUP BY d.day
    ORDER BY d.day ASC
  `;

  const { rows } = await pool.query(query, [userId]);
  
  // Calculate key metrics
  const totalCompletedQuery = `
    SELECT 
      COUNT(*)::int as total_completed,
      COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE - INTERVAL '7 days')::int as last_7_days,
      (SELECT COUNT(*) FROM tasks WHERE user_id = $1) as total_tasks
    FROM tasks 
    WHERE user_id = $1 AND completed = true
  `;
  
  const metricsRes = await pool.query(totalCompletedQuery, [userId]);
  const metrics = metricsRes.rows[0];
  
  const completionRate = metrics.total_tasks > 0 
    ? Math.round((metrics.total_completed / metrics.total_tasks) * 100) 
    : 0;
    
  const mostProductiveDay = [...rows].sort((a, b) => b.count - a.count)[0];
  const averageVelocity = (metrics.last_7_days / 7).toFixed(1);

  return {
    dailyStats: rows.map(r => ({
      date: r.day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      completions: r.count
    })),
    summary: {
      completionRate: `${completionRate}%`,
      mostProductiveDay: mostProductiveDay?.count > 0 
        ? mostProductiveDay.day.toLocaleDateString(undefined, { weekday: 'long' }) 
        : 'N/A',
      averageVelocity: `${averageVelocity} tasks/day`
    }
  };
}

module.exports = {
  getProductivityStats
};
