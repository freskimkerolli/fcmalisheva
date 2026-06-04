const { getPool } = require("../db");
const sample = require("./sampleData");

// ── mappers ───────────────────────────────────────────────────────────────────
function mapPlayer(r) {
  return {
    id: String(r.id),
    name: r.name,
    position: r.position,
    number: r.number,
    photo: r.photo,
    nationality: r.nationality,
    birthDate: r.birth_date
      ? new Date(r.birth_date).toISOString().slice(0, 10)
      : r.birthDate,
    height: r.height,
    weight: r.weight,
    captain: r.captain || false,
  };
}

function mapStaff(r) {
  return { id: String(r.id), name: r.name, role: r.role, email: r.email, photo: r.photo };
}

function mapResult(r) {
  return {
    id: String(r.id),
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
    matchday: r.matchday || r.matchday || "",
    opponent: r.opponent,
    score: r.score,
    competition: r.competition,
    isHome: r.is_home ?? r.isHome ?? true,
  };
}

// ── Players ───────────────────────────────────────────────────────────────────
async function getPlayers() {
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query("SELECT * FROM players ORDER BY number");
    return rows.map(mapPlayer);
  }
  return sample.players.map((p) => ({ ...p }));
}

async function createPlayer(data) {
  const pool = getPool();
  const { name, position, number, photo, nationality, birthDate, height, weight } = data;
  if (pool) {
    const { rows } = await pool.query(
      `INSERT INTO players (name, position, number, photo, nationality, birth_date, height, weight)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, position, Number(number), photo, nationality, birthDate || null, height, weight]
    );
    return mapPlayer(rows[0]);
  }
  const p = { id: String(Date.now()), name, position, number: Number(number), photo, nationality, birthDate, height, weight };
  sample.players.push(p);
  return p;
}

async function updatePlayer(id, data) {
  const pool = getPool();
  const { name, position, number, photo, nationality, birthDate, height, weight } = data;
  if (pool) {
    const { rows } = await pool.query(
      `UPDATE players SET name=$1, position=$2, number=$3, photo=$4, nationality=$5,
       birth_date=$6, height=$7, weight=$8 WHERE id=$9 RETURNING *`,
      [name, position, Number(number), photo, nationality, birthDate || null, height, weight, Number(id)]
    );
    return rows.length ? mapPlayer(rows[0]) : null;
  }
  const idx = sample.players.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  sample.players[idx] = { ...sample.players[idx], ...data, number: Number(number), photo };
  return sample.players[idx];
}

async function deletePlayer(id) {
  const pool = getPool();
  if (pool) {
    const { rowCount } = await pool.query("DELETE FROM players WHERE id=$1", [Number(id)]);
    return rowCount > 0;
  }
  const idx = sample.players.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  sample.players.splice(idx, 1);
  return true;
}

// ── Staff ─────────────────────────────────────────────────────────────────────
async function getStaff() {
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query("SELECT * FROM staff ORDER BY id");
    return rows.map(mapStaff);
  }
  return sample.staff.map((s) => ({ ...s }));
}

async function createStaffMember(data) {
  const pool = getPool();
  const { name, role, email, photo } = data;
  if (pool) {
    const { rows } = await pool.query(
      "INSERT INTO staff (name, role, email, photo) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, role, email, photo]
    );
    return mapStaff(rows[0]);
  }
  const m = { id: String(Date.now()), name, role, email, photo };
  sample.staff.push(m);
  return m;
}

async function updateStaffMember(id, data) {
  const pool = getPool();
  const { name, role, email, photo } = data;
  if (pool) {
    const { rows } = await pool.query(
      "UPDATE staff SET name=$1, role=$2, email=$3, photo=$4 WHERE id=$5 RETURNING *",
      [name, role, email, photo, Number(id)]
    );
    return rows.length ? mapStaff(rows[0]) : null;
  }
  const idx = sample.staff.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sample.staff[idx] = { ...sample.staff[idx], ...data, photo };
  return sample.staff[idx];
}

async function deleteStaffMember(id) {
  const pool = getPool();
  if (pool) {
    const { rowCount } = await pool.query("DELETE FROM staff WHERE id=$1", [Number(id)]);
    return rowCount > 0;
  }
  const idx = sample.staff.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  sample.staff.splice(idx, 1);
  return true;
}

// ── Gallery ───────────────────────────────────────────────────────────────────
async function getGallery() {
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query("SELECT url FROM gallery ORDER BY created_at");
    return rows.map((r) => r.url);
  }
  return [...sample.gallery];
}

async function addGalleryPhoto(url) {
  const pool = getPool();
  if (pool) {
    await pool.query("INSERT INTO gallery (url) VALUES ($1)", [url]);
  } else {
    sample.gallery.push(url);
  }
  return url;
}

async function removeGalleryPhoto(url) {
  const pool = getPool();
  if (pool) {
    const { rowCount } = await pool.query("DELETE FROM gallery WHERE url=$1", [url]);
    return rowCount > 0;
  }
  const idx = sample.gallery.indexOf(url);
  if (idx === -1) return false;
  sample.gallery.splice(idx, 1);
  return true;
}

// ── Results ───────────────────────────────────────────────────────────────────
async function getResults() {
  const pool = getPool();
  if (pool) {
    const [matchRes, tableRes] = await Promise.all([
      pool.query("SELECT * FROM results ORDER BY date DESC, created_at DESC"),
      pool.query("SELECT * FROM league_table ORDER BY position"),
    ]);
    return {
      matches: matchRes.rows.map(mapResult),
      table: tableRes.rows.map((r) => ({
        position: r.position, team: r.team, played: r.played, gd: r.gd ?? 0, points: r.points,
      })),
    };
  }
  return {
    matches: sample.results.map((r, i) => ({ id: String(i), ...r })),
    table: [...sample.table],
  };
}

async function createResult(data) {
  const pool = getPool();
  const { date, opponent, score, competition, venue, matchday } = data;
  if (pool) {
    const { rows } = await pool.query(
      `INSERT INTO results (date, opponent, score, competition, venue, matchday)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [date || null, opponent, score, competition, venue, matchday || null]
    );
    return mapResult(rows[0]);
  }
  const r = { id: String(Date.now()), date, opponent, score, competition, venue, matchday: matchday || "" };
  sample.results.unshift(r);
  return r;
}

async function updateResult(id, data) {
  const pool = getPool();
  const { date, opponent, score, competition, venue, matchday } = data;
  if (pool) {
    const { rows } = await pool.query(
      `UPDATE results SET date=$1, opponent=$2, score=$3, competition=$4, venue=$5, matchday=$6 WHERE id=$7 RETURNING *`,
      [date || null, opponent, score, competition, venue, matchday || null, Number(id)]
    );
    return rows.length ? mapResult(rows[0]) : null;
  }
  const idx = sample.results.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;
  sample.results[idx] = { ...sample.results[idx], date, opponent, score, competition, venue, matchday: matchday || "" };
  return sample.results[idx];
}

async function deleteResult(id) {
  const pool = getPool();
  if (pool) {
    const { rowCount } = await pool.query("DELETE FROM results WHERE id=$1", [Number(id)]);
    return rowCount > 0;
  }
  const idx = sample.results.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return false;
  sample.results.splice(idx, 1);
  return true;
}

async function updateTable(tableData) {
  const pool = getPool();
  if (pool) {
    await pool.query("DELETE FROM league_table");
    for (const row of tableData) {
      await pool.query(
        "INSERT INTO league_table (position, team, points, played) VALUES ($1,$2,$3,$4)",
        [row.position, row.team, row.points, row.played]
      );
    }
    return tableData;
  }
  sample.table.length = 0;
  tableData.forEach((row) => sample.table.push(row));
  return [...sample.table];
}

// ── Announcements ─────────────────────────────────────────────────────────────
async function getAnnouncements() {
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query("SELECT * FROM announcements ORDER BY created_at DESC");
    return rows;
  }
  return [...sample.announcements].map((a, i) => ({ id: String(i + 1), ...a }));
}

async function createAnnouncement(data) {
  const pool = getPool();
  const { title, title_en, content, content_en, category, category_en, date_display } = data;
  if (pool) {
    const { rows } = await pool.query(
      `INSERT INTO announcements (title,title_en,content,content_en,category,category_en,date_display)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, title_en, content, content_en, category, category_en, date_display]
    );
    return rows[0];
  }
  const a = { id: String(Date.now()), title, title_en, content, content_en, category, category_en, date_display };
  sample.announcements.unshift(a);
  return a;
}

async function updateAnnouncement(id, data) {
  const pool = getPool();
  const { title, title_en, content, content_en, category, category_en, date_display } = data;
  if (pool) {
    const { rows } = await pool.query(
      `UPDATE announcements SET title=$1,title_en=$2,content=$3,content_en=$4,category=$5,category_en=$6,date_display=$7
       WHERE id=$8 RETURNING *`,
      [title, title_en, content, content_en, category, category_en, date_display, Number(id)]
    );
    return rows.length ? rows[0] : null;
  }
  const idx = sample.announcements.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return null;
  sample.announcements[idx] = { ...sample.announcements[idx], ...data };
  return sample.announcements[idx];
}

async function deleteAnnouncement(id) {
  const pool = getPool();
  if (pool) {
    const { rowCount } = await pool.query("DELETE FROM announcements WHERE id=$1", [Number(id)]);
    return rowCount > 0;
  }
  const idx = sample.announcements.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;
  sample.announcements.splice(idx, 1);
  return true;
}

// ── Upcoming Match ─────────────────────────────────────────────────────────────
async function getUpcomingMatch() {
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query("SELECT * FROM upcoming_match LIMIT 1");
    return rows[0] || null;
  }
  return { id: "1", ...sample.upcomingMatch };
}

async function updateUpcomingMatch(data) {
  const pool = getPool();
  const { competition, matchday, stadium, home_team, home_logo, away_team, away_logo, match_date, match_time, ticket_url } = data;
  if (pool) {
    const existing = await pool.query("SELECT id FROM upcoming_match LIMIT 1");
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
  Object.assign(sample.upcomingMatch, data);
  return sample.upcomingMatch;
}

// ── Sponsors ───────────────────────────────────────────────────────────────────
async function getSponsors() {
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query("SELECT * FROM sponsors ORDER BY sort_order");
    return rows;
  }
  return sample.sponsors.map((s, i) => ({ id: String(i + 1), ...s }));
}

async function createSponsor(data) {
  const pool = getPool();
  const { name, logo_path, website_url, sort_order } = data;
  if (pool) {
    const { rows } = await pool.query(
      "INSERT INTO sponsors (name,logo_path,website_url,sort_order) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, logo_path, website_url || "#", Number(sort_order) || 0]
    );
    return rows[0];
  }
  const s = { id: String(Date.now()), name, logo_path, website_url: website_url || "#", sort_order: Number(sort_order) || 0 };
  sample.sponsors.push(s);
  return s;
}

async function updateSponsor(id, data) {
  const pool = getPool();
  const { name, logo_path, website_url, sort_order } = data;
  if (pool) {
    const { rows } = await pool.query(
      "UPDATE sponsors SET name=$1,logo_path=$2,website_url=$3,sort_order=$4 WHERE id=$5 RETURNING *",
      [name, logo_path, website_url || "#", Number(sort_order) || 0, Number(id)]
    );
    return rows.length ? rows[0] : null;
  }
  const idx = sample.sponsors.findIndex((s) => String(s.id) === String(id));
  if (idx === -1) return null;
  sample.sponsors[idx] = { ...sample.sponsors[idx], ...data };
  return sample.sponsors[idx];
}

async function deleteSponsor(id) {
  const pool = getPool();
  if (pool) {
    const { rowCount } = await pool.query("DELETE FROM sponsors WHERE id=$1", [Number(id)]);
    return rowCount > 0;
  }
  const idx = sample.sponsors.findIndex((s) => String(s.id) === String(id));
  if (idx === -1) return false;
  sample.sponsors.splice(idx, 1);
  return true;
}

module.exports = {
  getPlayers, createPlayer, updatePlayer, deletePlayer,
  getStaff, createStaffMember, updateStaffMember, deleteStaffMember,
  getGallery, addGalleryPhoto, removeGalleryPhoto,
  getResults, createResult, updateResult, deleteResult, updateTable,
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getUpcomingMatch, updateUpcomingMatch,
  getSponsors, createSponsor, updateSponsor, deleteSponsor,
};
