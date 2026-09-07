import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

let dbPath = path.join(process.cwd(), 'data', 'fondsnyt.db');

// Handle Vercel serverless environment (where root is read-only)
if (process.env.VERCEL) {
  const tmpPath = path.join('/tmp', 'fondsnyt.db');
  try {
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpPath);
      }
    }
    dbPath = tmpPath;
  } catch (e) {
    console.warn('Fallback to memory/temp db:', e);
  }
} else {
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

const sqlite = new Database(dbPath);

// Prevent SQLITE_BUSY errors with concurrency timeout and journal optimizations
try {
  sqlite.pragma('busy_timeout = 5000');
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
} catch (e) {
  // Ignored if unsupported
}

export const db = drizzle(sqlite, { schema });

// Auto-initialize tables only if not already present
export function initDb() {
  try {
    // Fast check: if foundations table already exists, skip heavy schema DDL
    const tableCheck = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='foundations'").get();
    if (tableCheck) {
      return;
    }

    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS foundations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cvr TEXT,
      website_url TEXT NOT NULL,
      type TEXT DEFAULT 'Private Fond',
      description TEXT,
      logo_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS grants (
      id TEXT PRIMARY KEY,
      foundation_id TEXT NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      categories TEXT NOT NULL,
      target_groups TEXT NOT NULL,
      min_amount REAL,
      max_amount REAL,
      currency TEXT DEFAULT 'DKK' NOT NULL,
      region TEXT DEFAULT 'Danmark' NOT NULL,
      source_url TEXT NOT NULL,
      application_url TEXT,
      success_rate_est TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS grant_deadlines (
      id TEXT PRIMARY KEY,
      grant_id TEXT NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
      deadline_date TEXT,
      is_ongoing INTEGER DEFAULT 0 NOT NULL,
      notes TEXT,
      quarter TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS monitored_sources (
      id TEXT PRIMARY KEY,
      foundation_id TEXT NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
      source_type TEXT NOT NULL,
      target_url TEXT NOT NULL,
      content_selector TEXT,
      last_content_hash TEXT,
      last_checked_at TEXT,
      last_status TEXT DEFAULT 'OK',
      status TEXT DEFAULT 'ACTIVE' NOT NULL,
      detected_changes_summary TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fundraising_pipeline (
      id TEXT PRIMARY KEY,
      grant_id TEXT NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
      project_title TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      requested_amount REAL,
      custom_deadline TEXT,
      submission_date TEXT,
      decision_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  } catch (e) {
    console.warn('Database initialization warning:', e);
  }
}

// Call init on import
initDb();
