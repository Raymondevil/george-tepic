// Este archivo se mantiene para compatibilidad con Cloudflare Workers
// Pero el punto de entrada principal para Node.js es server.ts
// Si necesitas usar Cloudflare Workers, este archivo sigue siendo válido

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import apiRouter from './routes/api'
import viewsRouter from './routes/views'

type Env = {
  DB: any // Para compatibilidad con Cloudflare Workers
}

const app = new Hono<Env>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Register default JSX layout renderer
app.use(renderer)

// Mount modular sub-routers
app.route('/api', apiRouter)
app.route('/', viewsRouter)

export default app
