export default async function handler(req, res) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.json({ status: 'NO_DATABASE_URL', message: 'DATABASE_URL nuk është vendosur në Vercel env vars' });
  }

  try {
    const { getPool } = await import('../../lib/db');
    const pool = await getPool();
    if (!pool) return res.json({ status: 'POOL_NULL' });

    const { rows } = await pool.query('SELECT COUNT(*) FROM players');
    res.json({
      status: 'OK',
      db_connected: true,
      players_count: Number(rows[0].count),
      db_host: dbUrl.split('@')[1]?.split('/')[0] || 'hidden',
    });
  } catch (e) {
    res.json({ status: 'ERROR', error: e.message });
  }
}