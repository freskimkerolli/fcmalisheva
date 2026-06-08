import { getPool } from './db';

function mapPlayer(r) {
  return {
    id: String(r.id), name: r.name, position: r.position, number: r.number,
    photo: r.photo, nationality: r.nationality,
    birthDate: r.birth_date ? new Date(r.birth_date).toISOString().slice(0, 10) : r.birthDate,
    height: r.height, weight: r.weight, captain: r.captain || false,
  };
}
function mapStaff(r) {
  return { id: String(r.id), name: r.name, role: r.role, email: r.email, photo: r.photo };
}
function mapResult(r) {
  return {
    id: String(r.id),
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
    matchday: r.matchday || '',
    opponent: r.opponent, score: r.score, competition: r.competition,
    isHome: r.is_home ?? r.isHome ?? true,
  };
}

// ── Players ──────────────────────────────────────────────────────────────────
export async function getPlayers() {
  const pool = await getPool();
  if (!pool) return [];
  const { rows } = await pool.query('SELECT * FROM players ORDER BY number');
  return rows.map(mapPlayer);
}
export async function createPlayer(data) {
  const pool = await getPool();
  const { name, position, number, photo, nationality, birthDate, height, weight, captain } = data;
  const isCaptain = captain === true || captain === 'true';
  if (isCaptain) await pool.query('UPDATE players SET captain=false');
  const { rows } = await pool.query(
    `INSERT INTO players (name,position,number,photo,nationality,birth_date,height,weight,captain)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [name, position, Number(number), photo, nationality, birthDate || null, height, weight, isCaptain]
  );
  return mapPlayer(rows[0]);
}
export async function updatePlayer(id, data) {
  const pool = await getPool();
  const { name, position, number, photo, nationality, birthDate, height, weight, captain } = data;
  const isCaptain = captain === true || captain === 'true';
  if (isCaptain) await pool.query('UPDATE players SET captain=false WHERE id!=$1', [Number(id)]);
  const { rows } = await pool.query(
    `UPDATE players SET name=$1,position=$2,number=$3,photo=$4,nationality=$5,
     birth_date=$6,height=$7,weight=$8,captain=$9 WHERE id=$10 RETURNING *`,
    [name, position, Number(number), photo, nationality, birthDate || null, height, weight, isCaptain, Number(id)]
  );
  return rows.length ? mapPlayer(rows[0]) : null;
}
export async function deletePlayer(id) {
  const pool = await getPool();
  const { rowCount } = await pool.query('DELETE FROM players WHERE id=$1', [Number(id)]);
  return rowCount > 0;
}

// ── Staff ─────────────────────────────────────────────────────────────────────
export async function getStaff() {
  const pool = await getPool();
  if (!pool) return [];
  const { rows } = await pool.query('SELECT * FROM staff ORDER BY id');
  return rows.map(mapStaff);
}
export async function createStaffMember(data) {
  const pool = await getPool();
  const { name, role, email, photo } = data;
  const { rows } = await pool.query(
    'INSERT INTO staff (name,role,email,photo) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, role, email, photo]
  );
  return mapStaff(rows[0]);
}
export async function updateStaffMember(id, data) {
  const pool = await getPool();
  const { name, role, email, photo } = data;
  const { rows } = await pool.query(
    'UPDATE staff SET name=$1,role=$2,email=$3,photo=$4 WHERE id=$5 RETURNING *',
    [name, role, email, photo, Number(id)]
  );
  return rows.length ? mapStaff(rows[0]) : null;
}
export async function deleteStaffMember(id) {
  const pool = await getPool();
  const { rowCount } = await pool.query('DELETE FROM staff WHERE id=$1', [Number(id)]);
  return rowCount > 0;
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export async function getGallery() {
  const pool = await getPool();
  if (!pool) return [];
  const { rows } = await pool.query('SELECT url FROM gallery ORDER BY created_at');
  return rows.map((r) => r.url);
}
export async function addGalleryPhoto(url) {
  const pool = await getPool();
  await pool.query('INSERT INTO gallery (url) VALUES ($1)', [url]);
  return url;
}
export async function removeGalleryPhoto(url) {
  const pool = await getPool();
  const { rowCount } = await pool.query('DELETE FROM gallery WHERE url=$1', [url]);
  return rowCount > 0;
}

// ── Results ───────────────────────────────────────────────────────────────────
export async function getResults() {
  const pool = await getPool();
  if (!pool) return { matches: [], table: [] };
  const [matchRes, tableRes] = await Promise.all([
    pool.query('SELECT * FROM results ORDER BY date DESC, created_at DESC'),
    pool.query('SELECT * FROM league_table ORDER BY position'),
  ]);
  return {
    matches: matchRes.rows.map(mapResult),
    table: tableRes.rows.map((r) => ({
      position: r.position, team: r.team, played: r.played, gd: r.gd ?? 0, points: r.points,
    })),
  };
}
export async function createResult(data) {
  const pool = await getPool();
  const { date, opponent, score, competition, venue, matchday, isHome } = data;
  const { rows } = await pool.query(
    `INSERT INTO results (date,opponent,score,competition,venue,matchday,is_home)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [date || null, opponent, score, competition, venue, matchday || null, isHome !== false]
  );
  return mapResult(rows[0]);
}
export async function updateResult(id, data) {
  const pool = await getPool();
  const { date, opponent, score, competition, venue, matchday, isHome } = data;
  const { rows } = await pool.query(
    `UPDATE results SET date=$1,opponent=$2,score=$3,competition=$4,venue=$5,matchday=$6,is_home=$7
     WHERE id=$8 RETURNING *`,
    [date || null, opponent, score, competition, venue, matchday || null, isHome !== false, Number(id)]
  );
  return rows.length ? mapResult(rows[0]) : null;
}
export async function deleteResult(id) {
  const pool = await getPool();
  const { rowCount } = await pool.query('DELETE FROM results WHERE id=$1', [Number(id)]);
  return rowCount > 0;
}
export async function updateTable(tableData) {
  const pool = await getPool();
  await pool.query('DELETE FROM league_table');
  for (const row of tableData) {
    await pool.query(
      'INSERT INTO league_table (position,team,points,played) VALUES ($1,$2,$3,$4)',
      [row.position, row.team, row.points, row.played]
    );
  }
  return tableData;
}

// ── Announcements ─────────────────────────────────────────────────────────────
export async function getAnnouncements() {
  const pool = await getPool();
  if (!pool) return [];
  const { rows } = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
  return rows;
}
export async function createAnnouncement(data) {
  const pool = await getPool();
  const { title, title_en, content, content_en, category, category_en, date_display } = data;
  const { rows } = await pool.query(
    `INSERT INTO announcements (title,title_en,content,content_en,category,category_en,date_display)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, title_en, content, content_en, category, category_en, date_display]
  );
  return rows[0];
}
export async function updateAnnouncement(id, data) {
  const pool = await getPool();
  const { title, title_en, content, content_en, category, category_en, date_display } = data;
  const { rows } = await pool.query(
    `UPDATE announcements SET title=$1,title_en=$2,content=$3,content_en=$4,
     category=$5,category_en=$6,date_display=$7 WHERE id=$8 RETURNING *`,
    [title, title_en, content, content_en, category, category_en, date_display, Number(id)]
  );
  return rows.length ? rows[0] : null;
}
export async function deleteAnnouncement(id) {
  const pool = await getPool();
  const { rowCount } = await pool.query('DELETE FROM announcements WHERE id=$1', [Number(id)]);
  return rowCount > 0;
}

// ── Upcoming Match ─────────────────────────────────────────────────────────────
export async function getUpcomingMatch() {
  const pool = await getPool();
  if (!pool) return null;
  const { rows } = await pool.query('SELECT * FROM upcoming_match LIMIT 1');
  return rows[0] || null;
}
export async function updateUpcomingMatch(data) {
  const pool = await getPool();
  const { competition, matchday, stadium, home_team, home_logo, away_team, away_logo, match_date, match_time, ticket_url } = data;
  const existing = await pool.query('SELECT id FROM upcoming_match LIMIT 1');
  if (existing.rows.length) {
    const { rows } = await pool.query(
      `UPDATE upcoming_match SET competition=$1,matchday=$2,stadium=$3,home_team=$4,home_logo=$5,
       away_team=$6,away_logo=$7,match_date=$8,match_time=$9,ticket_url=$10 WHERE id=$11 RETURNING *`,
      [competition, matchday, stadium, home_team, home_logo, away_team, away_logo, match_date, match_time, ticket_url, existing.rows[0].id]
    );
    return rows[0];
  } else {
    const { rows } = await pool.query(
      `INSERT INTO upcoming_match (competition,matchday,stadium,home_team,home_logo,away_team,away_logo,match_date,match_time,ticket_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [competition, matchday, stadium, home_team, home_logo, away_team, away_logo, match_date, match_time, ticket_url]
    );
    return rows[0];
  }
}

// ── Sponsors ───────────────────────────────────────────────────────────────────
export async function getSponsors() {
  const pool = await getPool();
  if (!pool) return [];
  const { rows } = await pool.query('SELECT * FROM sponsors ORDER BY sort_order');
  return rows;
}
export async function createSponsor(data) {
  const pool = await getPool();
  const { name, logo_path, website_url, sort_order } = data;
  const { rows } = await pool.query(
    'INSERT INTO sponsors (name,logo_path,website_url,sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, logo_path, website_url || '#', Number(sort_order) || 0]
  );
  return rows[0];
}
export async function updateSponsor(id, data) {
  const pool = await getPool();
  const { name, logo_path, website_url, sort_order } = data;
  const { rows } = await pool.query(
    'UPDATE sponsors SET name=$1,logo_path=$2,website_url=$3,sort_order=$4 WHERE id=$5 RETURNING *',
    [name, logo_path, website_url || '#', Number(sort_order) || 0, Number(id)]
  );
  return rows.length ? rows[0] : null;
}
export async function deleteSponsor(id) {
  const pool = await getPool();
  const { rowCount } = await pool.query('DELETE FROM sponsors WHERE id=$1', [Number(id)]);
  return rowCount > 0;
}