import { Pool } from 'pg';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, position VARCHAR(50),
    number INTEGER, photo VARCHAR(255), nationality VARCHAR(100),
    birth_date DATE, height VARCHAR(20), weight VARCHAR(20), captain BOOLEAN DEFAULT FALSE
  );
  ALTER TABLE players ADD COLUMN IF NOT EXISTS captain BOOLEAN DEFAULT FALSE;
  CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, role VARCHAR(100),
    email VARCHAR(150), photo VARCHAR(255)
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY, url VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY, date DATE, opponent VARCHAR(100), score VARCHAR(20),
    competition VARCHAR(100), venue VARCHAR(100), matchday VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  );
  ALTER TABLE results ADD COLUMN IF NOT EXISTS matchday VARCHAR(50);
  CREATE TABLE IF NOT EXISTS league_table (
    id SERIAL PRIMARY KEY, position INTEGER, team VARCHAR(100),
    points INTEGER, played INTEGER, gd INTEGER DEFAULT 0
  );
  ALTER TABLE league_table ADD COLUMN IF NOT EXISTS gd INTEGER DEFAULT 0;
  CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY, title VARCHAR(255), title_en VARCHAR(255),
    content TEXT, content_en TEXT, category VARCHAR(50), category_en VARCHAR(50),
    date_display VARCHAR(100), created_at TIMESTAMP DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS upcoming_match (
    id SERIAL PRIMARY KEY, competition VARCHAR(100), matchday VARCHAR(50),
    stadium VARCHAR(100), home_team VARCHAR(100), home_logo VARCHAR(255),
    away_team VARCHAR(100), away_logo VARCHAR(255), match_date VARCHAR(50),
    match_time VARCHAR(10), ticket_url VARCHAR(255)
  );
  CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY, name VARCHAR(100), logo_path VARCHAR(255),
    website_url VARCHAR(255), sort_order INTEGER DEFAULT 0
  );
`;

let pool = null;
let initialized = false;

export async function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  if (!initialized) {
    const client = await pool.connect();
    try {
      await client.query(SCHEMA);
      initialized = true;
    } catch (e) {
      console.error('Schema init error:', e.message);
    } finally {
      client.release();
    }
  }
  return pool;
}