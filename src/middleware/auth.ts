import type { MiddlewareHandler } from 'hono'

export const checkAdminAuth: MiddlewareHandler = async (c, next) => {
  const sessionToken = c.req.header('authorization')?.replace('Bearer ', '') || c.req.query('token')
  
  if (!sessionToken) {
    return c.json({ success: false, error: 'Token requerido' }, 401)
  }
  
  const db = c.get('db')
  const session = db.prepare(`
    SELECT * FROM admin_sessions 
    WHERE session_token = ? AND expires_at > datetime('now')
  `).bind(sessionToken).first()
  
  if (!session) {
    return c.json({ success: false, error: 'Token inválido o expirado' }, 401)
  }
  
  await next()
}
