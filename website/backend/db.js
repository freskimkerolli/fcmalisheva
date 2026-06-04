const { Pool } = require("pg");
const sample = require("./data/sampleData");

let pool = null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS players (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    position   VARCHAR(50),
    number     INTEGER,
    photo      VARCHAR(255),
    nationality VARCHAR(100),
    birth_date DATE,
    height     VARCHAR(20),
    weight     VARCHAR(20),
    captain    BOOLEAN DEFAULT FALSE
  );
  ALTER TABLE players ADD COLUMN IF NOT EXISTS captain BOOLEAN DEFAULT FALSE;
  CREATE TABLE IF NOT EXISTS staff (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    role  VARCHAR(100),
    email VARCHAR(150),
    photo VARCHAR(255)
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id         SERIAL PRIMARY KEY,
    url        VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS results (
    id          SERIAL PRIMARY KEY,
    date        DATE,
    opponent    VARCHAR(100),
    score       VARCHAR(20),
    competition VARCHAR(100),
    venue       VARCHAR(100),
    created_at  TIMESTAMP DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS league_table (
    id       SERIAL PRIMARY KEY,
    position INTEGER,
    team     VARCHAR(100),
    points   INTEGER,
    played   INTEGER
  );
`;

async function seedIfEmpty(client) {
  const { rows } = await client.query("SELECT COUNT(*) FROM players");
  if (Number(rows[0].count) > 0) return;

  for (const p of sample.players) {
    await client.query(
      `INSERT INTO players (name, position, number, photo, nationality, birth_date, height, weight)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [p.name, p.position, p.number, p.photo, p.nationality, p.birthDate || null, p.height, p.weight]
    );
  }
  for (const s of sample.staff) {
    await client.query(
      "INSERT INTO staff (name, role, email, photo) VALUES ($1,$2,$3,$4)",
      [s.name, s.role, s.email, s.photo]
    );
  }
  for (const url of sample.gallery) {
    await client.query("INSERT INTO gallery (url) VALUES ($1)", [url]);
  }
  for (const r of sample.results) {
    await client.query(
      "INSERT INTO results (date, opponent, score, competition, venue) VALUES ($1,$2,$3,$4,$5)",
      [r.date || null, r.opponent, r.score, r.competition, r.venue]
    );
  }
  for (const row of sample.table) {
    await client.query(
      "INSERT INTO league_table (position, team, points, played) VALUES ($1,$2,$3,$4)",
      [row.position, row.team, row.points, row.played]
    );
  }
  console.log("PostgreSQL: të dhënat fillestare u ngarkuan.");
}

async function tryConnect(url) {
  const p = new Pool({ connectionString: url, connectionTimeoutMillis: 3000 });
  const client = await p.connect();
  await client.query(SCHEMA);
  await seedIfEmpty(client);
  client.release();
  return p;
}

const connectDatabase = async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("DATABASE_URL nuk është caktuar — backend punon me të dhëna statike.");
    return;
  }

  const attempt = async () => {
    try {
      pool = await tryConnect(url);
      console.log("Connected to PostgreSQL");
    } catch (err) {
      console.warn("PostgreSQL nuk u lidh, riprovoj pas 10s:", err.message);
      pool = null;
      setTimeout(attempt, 10000);
    }
  };

  await attempt();
};

function getPool() {
  return pool;
}

module.exports = { connectDatabase, getPool };
