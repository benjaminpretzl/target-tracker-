import Database from 'better-sqlite3'
import path from 'path'

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof Database> | undefined
}

function createDb() {
  const db = new Database(path.join(process.cwd(), 'data.db'))
  db.pragma('journal_mode = WAL')
  db.pragma('busy_timeout = 5000')
  db.pragma('foreign_keys = ON')
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      title          TEXT NOT NULL,
      description    TEXT,
      status         TEXT NOT NULL DEFAULT 'backlog' CHECK(status IN ('backlog','in_progress','done')),
      priority       TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low','medium','high')),
      due_date       TEXT,
      project_id     INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      parent_task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      assignee_id    INTEGER REFERENCES team_members(id) ON DELETE SET NULL,
      created_at     TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
  return db
}

export const db = globalThis.__db ?? (() => {
  const instance = createDb()
  if (process.env.NODE_ENV !== 'production') globalThis.__db = instance
  return instance
})()
