import { Hono } from 'hono'
import { checkAdminAuth } from '../../middleware/auth'
import type { Env } from '../../types'

const adminApi = new Hono<Env>()

// Login administrativo
adminApi.post('/login', async (c) => {
  const { password } = await c.req.json()
  const adminPassword = process.env.ADMIN_PASSWORD || 'george2024'
  
  if (password !== adminPassword) {
    return c.json({ success: false, error: 'Contraseña incorrecta' }, 401)
  }
  
  const db = c.get('db')
  const sessionToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
  
  db.prepare(`
    INSERT INTO admin_sessions (session_token, expires_at, ip_address)
    VALUES (?, ?, ?)
  `).bind(sessionToken, expiresAt, c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown').run()
  
  return c.json({ success: true, token: sessionToken })
})

// APIs de inventario
adminApi.get('/inventory', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const result = db.prepare(`
    SELECT * FROM inventory ORDER BY category, name
  `).all()
  return c.json(result)
})

adminApi.post('/inventory', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const { name, quantity_sent, quantity_remaining, total_stock, category, unit } = await c.req.json()
  
  const result = db.prepare(`
    INSERT INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(name, quantity_sent || 0, quantity_remaining || 0, total_stock || 0, category || 'general', unit || 'piezas').run()
  
  return c.json({ success: true, id: result.lastInsertRowid })
})

adminApi.get('/inventory/:id', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  
  const result = db.prepare(`SELECT * FROM inventory WHERE id = ?`).bind(id).get() as { id: number; name: string; quantity_sent: number; quantity_remaining: number; total_stock: number; category: string; unit: string } | undefined
  
  if (!result) {
    return c.json({ success: false, error: 'Producto no encontrado' }, 404)
  }
  
  return c.json(result)
})

adminApi.put('/inventory/:id', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const { name, quantity_sent, quantity_remaining, total_stock, category, unit } = await c.req.json()
  
  db.prepare(`
    UPDATE inventory 
    SET name = ?, quantity_sent = ?, quantity_remaining = ?, total_stock = ?, 
        category = ?, unit = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(name, quantity_sent, quantity_remaining, total_stock, category, unit, id).run()
  
  return c.json({ success: true })
})

adminApi.delete('/inventory/:id', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  
  db.prepare(`DELETE FROM inventory WHERE id = ?`).bind(id).run()
  return c.json({ success: true })
})

// API de cálculos diarios
adminApi.get('/calculations', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const date = c.req.query('date') || new Date().toISOString().split('T')[0]
  
  const result = db.prepare(`
    SELECT * FROM daily_calculations WHERE date = ?
  `).bind(date).get() as { date: string; calculation_data: string; total_sales: number; expenses: number; profit: number; notes?: string } | undefined
  
  return c.json(result || { date, calculation_data: '{}', total_sales: 0, expenses: 0, profit: 0 })
})

adminApi.post('/calculations', checkAdminAuth, async (c) => {
  const db = c.get('db')
  const { date, calculation_data, total_sales, expenses, profit, notes } = await c.req.json()
  
  db.prepare(`
    INSERT OR REPLACE INTO daily_calculations (date, calculation_data, total_sales, expenses, profit, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(date, calculation_data, total_sales, expenses, profit, notes || '').run()
  
  return c.json({ success: true })
})

export default adminApi
