const pool = require('../../db/pool.js');

async function create(user) {
  const query = `
    INSERT INTO users (name, email, password_hash, role, google_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role, notification_preferences, view_preference, google_id, created_at, updated_at
  `;
  const values = [user.name, user.email, user.passwordHash || null, user.role || 'user', user.googleId || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

async function findByGoogleId(googleId) {
  const query = 'SELECT * FROM users WHERE google_id = $1';
  const { rows } = await pool.query(query, [googleId]);
  return rows[0];
}

async function findById(id) {
  const query = 'SELECT id, name, email, role, notification_preferences, view_preference, google_id, created_at, updated_at FROM users WHERE id = $1::UUID';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function update(id, data) {
  const ALLOWED = ['name', 'email', 'notification_preferences', 'password_hash', 'view_preference', 'google_id'];
  const safeData = Object.fromEntries(
    Object.entries(data).filter(([k, v]) => ALLOWED.includes(k) && v !== undefined)
  );
  const fields = Object.keys(safeData);
  if (fields.length === 0) return null;

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(', ');
  const values = [id, ...Object.values(safeData)];

  const query = `
    UPDATE users
    SET ${setClause}, updated_at = NOW()
    WHERE id = $1::UUID
    RETURNING id, name, email, role, notification_preferences, view_preference, google_id, created_at, updated_at
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updatePassword(id, passwordHash) {
  const query = `
    UPDATE users
    SET password_hash = $2, updated_at = NOW()
    WHERE id = $1::UUID
  `;
  await pool.query(query, [id, passwordHash]);
}

async function findFullById(id) {
  const query = 'SELECT * FROM users WHERE id = $1::UUID';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  create,
  findByEmail,
  findByGoogleId,
  findById,
  findFullById,
  update,
  updatePassword,
};
