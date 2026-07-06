import Database from 'better-sqlite3'
import path from 'path'

// Crear conexión a SQLite
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'database.sqlite')

export const db = new Database(dbPath)

// Habilitar modo WAL para mejor rendimiento
// db.pragma('journal_mode = WAL')

// Configuración para manejar consultas
// db.pragma('foreign_keys = ON')

// Exportar para usar en toda la aplicación
export default db
