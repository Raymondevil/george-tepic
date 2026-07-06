import type { Order } from '../types'

export function generateWhatsAppMessage(order: Order, orderId: number): string {
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
