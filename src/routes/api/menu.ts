import { Hono } from 'hono'

const menuApi = new Hono()

menuApi.get('/menu', async (c) => {
  const db = c.get('db')
  const result = db.prepare(`
    SELECT * FROM menu_items ORDER BY category, name
  `).all()
  return c.json(result)
})

menuApi.get('/extras', async (c) => {
  const db = c.get('db')
  const result = db.prepare(`
    SELECT * FROM extra_ingredients ORDER BY category, name
  `).all()
  return c.json(result)
})

export default menuApi
