import type { MiddlewareHandler } from 'hono'
import type { Env } from '../types'

export const checkAdminAuth: MiddlewareHandler<Env> = async (c, next) => {
  const sessionToken = c.req.header('authorization')?.replace('Bearer ', '') || c.req.query('token')
  
  if (!sessionToken) {
    return c.json({ success: false, error: 'Token requerido' }, 401)
  }
  
  const db = c.get('db')
  const session = db.prepare(`
    SELECT * FROM admin_sessions 
    WHERE session_token = ? AND expires_at > datetime('now')
  `).bind(sessionToken).get() as { id: number; session_token: string; expires_at: string; ip_address?: string } | undefined
  
  if (!session) {
    return c.json({ success: false, error: 'Token inválido o expirado' }, 401)
  }
  
  await next()
}
