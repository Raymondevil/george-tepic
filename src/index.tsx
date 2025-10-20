import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import type { CloudflareBindings, MenuItem, ExtraIngredient, Order, Customer, OrderItem } from './types'

type Env = {
  Bindings: CloudflareBindings
}

const app = new Hono<Env>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

app.use(renderer)

// API Routes
app.get('/api/menu', async (c) => {
  const { DB } = c.env
  const result = await DB.prepare(`
    SELECT * FROM menu_items ORDER BY category, name
  `).all()
  return c.json(result.results)
})

app.get('/api/extras', async (c) => {
  const { DB } = c.env
  const result = await DB.prepare(`
    SELECT * FROM extra_ingredients ORDER BY category, name
  `).all()
  return c.json(result.results)
})

app.post('/api/orders', async (c) => {
  const { DB } = c.env
  const orderData: Order = await c.req.json()
  
  try {
    // Start transaction - insert customer
    const customerResult = await DB.prepare(`
      INSERT OR REPLACE INTO customers (name, whatsapp, address, between_streets, neighborhood)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      orderData.customer.name,
      orderData.customer.whatsapp,
      orderData.customer.address || '',
      orderData.customer.between_streets || '',
      orderData.customer.neighborhood || ''
    ).run()
    
    const customerId = customerResult.meta.last_row_id
    
    // Insert order
    const orderResult = await DB.prepare(`
      INSERT INTO orders (customer_id, total_amount, delivery_type, delivery_cost, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(
      customerId,
      orderData.total_amount,
      orderData.delivery_type,
      orderData.delivery_cost
    ).run()
    
    const orderId = orderResult.meta.last_row_id
    
    // Insert order items
    for (const item of orderData.items) {
      await DB.prepare(`
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, extras, vegetables, sauces)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId,
        item.menu_item.id,
        item.quantity,
        item.total_price / item.quantity,
        JSON.stringify(item.extras),
        JSON.stringify(item.vegetables),
        JSON.stringify(item.sauces)
      ).run()
    }
    
    // Insert beverages if any
    if (orderData.beverages > 0) {
      await DB.prepare(`
        INSERT INTO beverages (order_id, quantity, unit_price)
        VALUES (?, ?, 30.00)
      `).bind(orderId, orderData.beverages).run()
    }
    
    return c.json({ 
      success: true, 
      orderId,
      whatsappMessage: generateWhatsAppMessage(orderData, orderId as number)
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return c.json({ success: false, error: 'Error creating order' }, 500)
  }
})

// Middleware de autenticación simple
async function checkAdminAuth(c: any, next: any) {
  const sessionToken = c.req.header('authorization')?.replace('Bearer ', '') || c.req.query('token')
  
  if (!sessionToken) {
    return c.json({ success: false, error: 'Token requerido' }, 401)
  }
  
  const { DB } = c.env
  const session = await DB.prepare(`
    SELECT * FROM admin_sessions 
    WHERE session_token = ? AND expires_at > datetime('now')
  `).bind(sessionToken).first()
  
  if (!session) {
    return c.json({ success: false, error: 'Token inválido o expirado' }, 401)
  }
  
  await next()
}

// Login administrativo
app.post('/api/admin/login', async (c) => {
  const { password } = await c.req.json()
  
  // Contraseña simple (en producción usar hash)
  if (password !== 'george2024') {
    return c.json({ success: false, error: 'Contraseña incorrecta' }, 401)
  }
  
  const { DB } = c.env
  const sessionToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
  
  await DB.prepare(`
    INSERT INTO admin_sessions (session_token, expires_at, ip_address)
    VALUES (?, ?, ?)
  `).bind(sessionToken, expiresAt, c.req.header('cf-connecting-ip') || 'unknown').run()
  
  return c.json({ success: true, token: sessionToken })
})

// APIs de inventario
app.get('/api/admin/inventory', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const result = await DB.prepare(`
    SELECT * FROM inventory ORDER BY category, name
  `).all()
  return c.json(result.results)
})

app.post('/api/admin/inventory', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const { name, quantity_sent, quantity_remaining, total_stock, category, unit } = await c.req.json()
  
  const result = await DB.prepare(`
    INSERT INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(name, quantity_sent || 0, quantity_remaining || 0, total_stock || 0, category || 'general', unit || 'piezas').run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

app.get('/api/admin/inventory/:id', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  
  const result = await DB.prepare(`SELECT * FROM inventory WHERE id = ?`).bind(id).first()
  
  if (!result) {
    return c.json({ success: false, error: 'Producto no encontrado' }, 404)
  }
  
  return c.json(result)
})

app.put('/api/admin/inventory/:id', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const { name, quantity_sent, quantity_remaining, total_stock, category, unit } = await c.req.json()
  
  await DB.prepare(`
    UPDATE inventory 
    SET name = ?, quantity_sent = ?, quantity_remaining = ?, total_stock = ?, 
        category = ?, unit = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(name, quantity_sent, quantity_remaining, total_stock, category, unit, id).run()
  
  return c.json({ success: true })
})

app.delete('/api/admin/inventory/:id', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  
  await DB.prepare(`DELETE FROM inventory WHERE id = ?`).bind(id).run()
  return c.json({ success: true })
})

// API de cálculos diarios
app.get('/api/admin/calculations', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const date = c.req.query('date') || new Date().toISOString().split('T')[0]
  
  const result = await DB.prepare(`
    SELECT * FROM daily_calculations WHERE date = ?
  `).bind(date).first()
  
  return c.json(result || { date, calculation_data: '{}', total_sales: 0, expenses: 0, profit: 0 })
})

app.post('/api/admin/calculations', checkAdminAuth, async (c) => {
  const { DB } = c.env
  const { date, calculation_data, total_sales, expenses, profit, notes } = await c.req.json()
  
  await DB.prepare(`
    INSERT OR REPLACE INTO daily_calculations (date, calculation_data, total_sales, expenses, profit, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(date, calculation_data, total_sales, expenses, profit, notes || '').run()
  
  return c.json({ success: true })
})

function generateWhatsAppMessage(order: Order, orderId: number): string {
  let message = `🍔 *GEORGE BURGER* 🍔\n`
  message += `📋 *Pedido #${orderId}*\n\n`
  
  message += `👤 *Cliente:* ${order.customer.name}\n`
  message += `📱 *WhatsApp:* ${order.customer.whatsapp}\n`
  
  if (order.delivery_type === 'delivery') {
    message += `🏠 *Entrega a domicilio*\n`
    message += `📍 *Dirección:* ${order.customer.address}\n`
    if (order.customer.between_streets) {
      message += `🛣️ *Entre calles:* ${order.customer.between_streets}\n`
    }
    if (order.customer.neighborhood) {
      message += `🏘️ *Colonia:* ${order.customer.neighborhood}\n`
    }
  } else {
    message += `🏃 *Para recoger en tienda*\n`
  }
  
  message += `\n📋 *PEDIDO:*\n`
  
  for (const item of order.items) {
    message += `\n${item.quantity}x *${item.menu_item.name}* - $${item.total_price}\n`
    message += `   ${item.menu_item.base_ingredients.replace(/\+/g, ', ')}\n`
    
    if (item.extras.length > 0) {
      message += `   + Extra: ${item.extras.map(e => e.name).join(', ')}\n`
    }
    
    const selectedVeggies = item.vegetables.map(v => v.name).join(', ')
    const selectedSauces = item.sauces.map(s => s.name).join(', ')
    
    if (selectedVeggies) {
      message += `   🥬 Verduras: ${selectedVeggies}\n`
    }
    if (selectedSauces) {
      message += `   🥄 Aderezos: ${selectedSauces}\n`
    }
  }
  
  if (order.beverages > 0) {
    message += `\n${order.beverages}x *Aguas y Refrescos* - $${order.beverages * 30}\n`
  }
  
  message += `\n💰 *Subtotal:* $${order.total_amount - order.delivery_cost}\n`
  
  if (order.delivery_cost > 0) {
    message += `🚚 *Costo de entrega:* $${order.delivery_cost}\n`
  }
  
  message += `💵 *TOTAL:* $${order.total_amount}\n`
  message += `\n¡Gracias por tu pedido! 🎉`
  
  return message
}

// Página de login administrativo
app.get('/admin/login', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">🔐 Admin</h1>
          <p className="text-gray-300">Acceso Administrativo</p>
        </div>
        
        <form id="admin-login-form" className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Contraseña de Administrador
            </label>
            <input 
              type="password" 
              id="admin-password" 
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="Ingresa la contraseña"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-orange-700 transition"
          >
            🚀 Acceder
          </button>
          
          <div className="text-center">
            <a href="/" className="text-orange-400 hover:text-orange-300 text-sm">
              ← Volver al Menú Principal
            </a>
          </div>
        </form>
        
        <div id="login-error" className="mt-4 text-red-400 text-center hidden"></div>
      </div>
      
      <script src="/static/admin-login.js"></script>
    </div>
  )
})

// Página de calculadora
app.get('/admin/calculadora', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-gray-800 shadow-2xl border-b border-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-orange-400">🧮 Calculadora Diaria</h1>
            <div className="space-x-4">
              <a href="/admin/inventario" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                📦 Inventario
              </a>
              <a href="/" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                🏠 Menú
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Calculadora de Ventas */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-orange-400 mb-4">💰 Ventas del Día</h2>
              <div className="space-y-4">
                <input type="date" id="calc-date" className="w-full p-3 bg-gray-600 text-white border border-gray-500 rounded-lg" />
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Ventas Totales:</label>
                  <input type="number" id="total-sales" className="w-full p-3 bg-gray-600 text-white border border-gray-500 rounded-lg" placeholder="0.00" step="0.01" />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Gastos del Día:</label>
                  <input type="number" id="total-expenses" className="w-full p-3 bg-gray-600 text-white border border-gray-500 rounded-lg" placeholder="0.00" step="0.01" />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Ganancia:</label>
                  <input type="number" id="total-profit" className="w-full p-3 bg-green-600 text-white border border-green-500 rounded-lg" readonly />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Notas:</label>
                  <textarea id="calc-notes" className="w-full p-3 bg-gray-600 text-white border border-gray-500 rounded-lg h-20" placeholder="Notas adicionales..."></textarea>
                </div>
                
                <button id="save-calculation" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                  💾 Guardar Cálculo
                </button>
              </div>
            </div>
            
            {/* Calculadora General */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-orange-400 mb-4">🔢 Calculadora</h2>
              <div className="space-y-4">
                <input type="text" id="calculator-display" className="w-full p-4 text-2xl text-right bg-gray-800 text-white border border-gray-500 rounded-lg" readonly />
                
                <div className="grid grid-cols-4 gap-3">
                  <button className="calc-btn bg-red-600 text-white p-3 rounded hover:bg-red-700" data-action="clear">C</button>
                  <button className="calc-btn bg-orange-600 text-white p-3 rounded hover:bg-orange-700" data-action="delete">⌫</button>
                  <button className="calc-btn bg-blue-600 text-white p-3 rounded hover:bg-blue-700" data-value="/">/</button>
                  <button className="calc-btn bg-blue-600 text-white p-3 rounded hover:bg-blue-700" data-value="*">×</button>
                  
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="7">7</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="8">8</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="9">9</button>
                  <button className="calc-btn bg-blue-600 text-white p-3 rounded hover:bg-blue-700" data-value="-">-</button>
                  
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="4">4</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="5">5</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="6">6</button>
                  <button className="calc-btn bg-blue-600 text-white p-3 rounded hover:bg-blue-700" data-value="+">+</button>
                  
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="1">1</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="2">2</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value="3">3</button>
                  <button className="calc-btn bg-green-600 text-white p-3 rounded hover:bg-green-700 row-span-2" data-action="equals">=</button>
                  
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500 col-span-2" data-value="0">0</button>
                  <button className="calc-btn bg-gray-600 text-white p-3 rounded hover:bg-gray-500" data-value=".">.</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      <script src="/static/admin-calculator.js"></script>
    </div>
  )
})

// Página de inventario
app.get('/admin/inventario', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-gray-800 shadow-2xl border-b border-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-orange-400">📦 Gestión de Inventario</h1>
            <div className="space-x-4">
              <a href="/admin/calculadora" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                🧮 Calculadora
              </a>
              <a href="/" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                🏠 Menú
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de agregar/editar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-orange-400 mb-4">➕ Agregar/Editar Producto</h2>
              
              <form id="inventory-form" className="space-y-4">
                <input type="hidden" id="edit-id" />
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Nombre del Producto:</label>
                  <input type="text" id="product-name" className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg" required />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Categoría:</label>
                  <select id="product-category" className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg">
                    <option value="panes">🥖 Panes</option>
                    <option value="verduras">🥬 Verduras</option>
                    <option value="carnes">🥩 Carnes</option>
                    <option value="quesos">🧀 Quesos</option>
                    <option value="bebidas">🥤 Bebidas</option>
                    <option value="dinero">💰 Dinero</option>
                    <option value="general">📦 General</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Cantidad Enviada:</label>
                  <input type="number" id="quantity-sent" className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg" min="0" />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Cantidad Restante:</label>
                  <input type="number" id="quantity-remaining" className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg" min="0" />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Total Existencia:</label>
                  <input type="number" id="total-stock" className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg" min="0" />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Unidad:</label>
                  <select id="product-unit" className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg">
                    <option value="piezas">Piezas</option>
                    <option value="kilos">Kilos</option>
                    <option value="litros">Litros</option>
                    <option value="latas">Latas</option>
                    <option value="pesos">Pesos</option>
                  </select>
                </div>
                
                <button type="submit" id="save-product" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                  💾 Guardar Producto
                </button>
                
                <button type="button" id="cancel-edit" className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 hidden">
                  ❌ Cancelar Edición
                </button>
              </form>
            </div>
          </div>
          
          {/* Lista de inventario */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold text-orange-400 mb-6">📋 Inventario Actual</h2>
              
              <div id="inventory-list" className="space-y-4">
                <div className="text-center text-gray-400 py-8">
                  <p>Cargando inventario...</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <script src="/static/admin-inventory.js"></script>
    </div>
  )
})

app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gray-800 shadow-2xl border-b border-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-400 mb-2">
              🍔 GEORGE BURGER 🍔
            </h1>
            <p className="text-gray-300">Hamburguesas, Hotdogs, Sincronizadas y más</p>
          </div>
          
          {/* Search Box */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="relative">
              <input 
                type="text" 
                id="search-input" 
                placeholder="🔍 Buscar hamburguesa, hotdog..." 
                className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <button id="clear-search" className="absolute right-2 top-2 text-gray-400 hover:text-white hidden">✕</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-orange-400">
                🍽️ MENÚ
              </h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center mb-6 gap-2" id="category-tabs">
                <button className="category-btn active bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition" data-category="hamburguesas">
                  🍔 Hamburguesas
                </button>
                <button className="category-btn bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" data-category="hotdogs">
                  🌭 Hotdogs
                </button>
                <button className="category-btn bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" data-category="sincronizadas">
                  🌮 Sincronizadas
                </button>
                <button className="category-btn bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" data-category="tortas">
                  🥪 Tortas
                </button>
                <button className="category-btn bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" data-category="burros">
                  🌯 Burros
                </button>
                <button className="category-btn bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" data-category="papas">
                  🍟 Papas
                </button>
              </div>

              {/* Menu Items Container */}
              <div id="menu-container" className="space-y-4">
                <div className="text-center text-gray-400 py-8">
                  <p>Cargando menú...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-center text-orange-400">
                🛒 Tu Pedido
              </h2>
              
              <div id="cart-items" className="space-y-3 mb-6">
                <p className="text-gray-400 text-center py-4">Tu carrito está vacío</p>
              </div>
              
              {/* Beverages Section */}
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-300">🥤 Aguas y Refrescos ($30 c/u)</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <button id="beverage-decrease" className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600">-</button>
                  <span id="beverage-count" className="font-bold text-lg w-8 text-center">0</span>
                  <button id="beverage-increase" className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600">+</button>
                </div>
              </div>
              
              {/* Delivery Options */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3 text-gray-300">🚚 Opciones de entrega:</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="delivery" value="pickup" className="text-orange-500" defaultChecked />
                    <span className="text-gray-300">🏃 Pasar a recoger (Gratis)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="delivery" value="delivery" className="text-orange-500" />
                    <span className="text-gray-300">🏠 Entrega a domicilio (+$20)</span>
                  </label>
                </div>
              </div>
              
              {/* Customer Info Form */}
              <div id="customer-form" className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3 text-gray-300">👤 Datos del cliente:</h3>
                <div className="space-y-3">
                  <input type="text" id="customer-name" placeholder="Nombre completo" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none" required />
                  <input type="tel" id="customer-whatsapp" placeholder="WhatsApp (ej: 5211234567890)" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none" required />
                  
                  <div id="delivery-fields" style={{display: 'none'}}>
                    <input type="text" id="customer-address" placeholder="Dirección completa" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none" />
                    <input type="text" id="customer-streets" placeholder="Entre qué calles" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none" />
                    <input type="text" id="customer-neighborhood" placeholder="Colonia" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              
              {/* Total */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-300">💵 TOTAL:</span>
                  <span id="cart-total" className="text-orange-400">$0</span>
                </div>
              </div>
              
              {/* Order Button */}
              <button id="place-order" className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition" disabled>
                🛒 HACER PEDIDO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <div id="order-modal" className="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4" style={{zIndex: 1000}}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-4">¡Pedido Realizado! 🎉</h3>
            <p className="mb-4 text-gray-300">Tu pedido ha sido enviado por WhatsApp</p>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-4 text-left">
              <h4 className="font-bold mb-2 text-gray-300">Mensaje enviado:</h4>
              <div id="whatsapp-preview" className="text-sm whitespace-pre-line text-gray-300"></div>
            </div>
            
            <div className="flex space-x-3">
              <button id="send-whatsapp" className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                📱 Abrir WhatsApp
              </button>
              <button id="close-modal" className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <script src="/static/app.js"></script>
    </div>
  )
})

export default app
