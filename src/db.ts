import Database from 'better-sqlite3'
import path from 'path'

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'database.sqlite')

export const db = new Database(dbPath)

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL')

// Enable foreign keys
db.pragma('foreign_keys = ON')

export default db
