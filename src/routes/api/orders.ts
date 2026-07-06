import { Hono } from 'hono'
import type { Order } from '../../types'
import { generateWhatsAppMessage } from '../../utils/whatsapp'

const ordersApi = new Hono()

ordersApi.post('/', async (c) => {
  const db = c.get('db')
  const orderData: Order = await c.req.json()
  
  try {
    // Start transaction - insert customer
    const customerResult = db.prepare(`
      INSERT OR REPLACE INTO customers (name, whatsapp, address, between_streets, neighborhood)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      orderData.customer.name,
      orderData.customer.whatsapp,
      orderData.customer.address || '',
      orderData.customer.between_streets || '',
      orderData.customer.neighborhood || ''
    ).run()
    
    const customerId = customerResult.lastInsertRowid
    
    // Insert order
    const orderResult = db.prepare(`
      INSERT INTO orders (customer_id, total_amount, delivery_type, delivery_cost, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(
      customerId,
      orderData.total_amount,
      orderData.delivery_type,
      orderData.delivery_cost
    ).run()
    
    const orderId = orderResult.lastInsertRowid
    
    // Insert order items
    for (const item of orderData.items) {
      db.prepare(`
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
      db.prepare(`
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

export default ordersApi
