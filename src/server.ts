import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/node-server/serve-static'
import { renderer } from './renderer'
import apiRouter from './routes/api'
import viewsRouter from './routes/views'
import { db } from './db'

// Tipo de entorno para Node.js
// Ya no necesitamos Cloudflare bindings, usamos la DB directamente
const app = new Hono()

// Middleware para agregar la conexión a BD a cada contexto
app.use('*', async (c, next) => {
  // Agregar la base de datos al contexto
  c.set('db', db)
  await next()
})

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Register default JSX layout renderer
app.use(renderer)

// Mount modular sub-routers
app.route('/api', apiRouter)
app.route('/', viewsRouter)

// Iniciar servidor
export const port = parseInt(process.env.PORT || '3000', 10)

if (import.meta.main) {
  console.log(`🍔 George Burger Server starting...`)
  console.log(`📁 Database path: ${process.env.DB_PATH || 'database.sqlite'}`)
  console.log(`🌐 Server running on http://localhost:${port}`)
  
  serve({
    fetch: app.fetch,
    port
  }, () => {
    console.log(`✅ Server ready!`)
  })
}

export default app
