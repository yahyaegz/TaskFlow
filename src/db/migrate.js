const fs = require('fs');
const path = require('path');
const pool = require('./pool.js');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function runMigrations() {
  await ensureMigrationsTable();
  
  const sqlDir = path.join(__dirname, '../../sql');
  const files = fs.readdirSync(sqlDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const { rows } = await pool.query('SELECT name FROM migrations');
  const executedMigrations = new Set(rows.map(r => r.name));

  for (const file of files) {
    if (executedMigrations.has(file)) {
      console.log(`Skipping already executed migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(sqlDir, file), 'utf8');
    console.log(`Running migration: ${file}`);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  console.log('Migrations completed successfully.');
}

runMigrations()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
