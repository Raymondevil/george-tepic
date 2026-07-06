import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'database.sqlite')
const db = new Database(dbPath)

console.log('🌱 Iniciando seed de la base de datos...')
console.log(`📁 Base de datos: ${dbPath}`)

// Leer el archivo seed.sql
const seedPath = path.join(process.cwd(), 'seed.sql')
if (!fs.existsSync(seedPath)) {
  console.error('❌ Archivo seed.sql no encontrado')
  process.exit(1)
}

const seedSql = fs.readFileSync(seedPath, 'utf8')

try {
  // Ejecutar el seed
  db.exec(seedSql)
  console.log('✅ Seed completado con éxito!')
  
  // Contar registros insertados
  const menuCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count
  const extrasCount = db.prepare('SELECT COUNT(*) as count FROM extra_ingredients').get().count
  const inventoryCount = db.prepare('SELECT COUNT(*) as count FROM inventory').get()?.count || 0
  
  console.log(`📊 Estadísticas:`)
  console.log(`   - Productos del menú: ${menuCount}`)
  console.log(`   - Ingredientes extra: ${extrasCount}`)
  console.log(`   - Inventario: ${inventoryCount}`)
  
} catch (error) {
  console.error('❌ Error al ejecutar seed:', error)
  process.exit(1)
} finally {
  db.close()
}
