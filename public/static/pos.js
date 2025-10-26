// POS System JavaScript
let posMenu = [];
let posExtras = [];
let posSale = [];
let posBeverageCount = 0;
let posCurrentCategory = 'hamburguesas';

// Initialize POS when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  await loadPosData();
  setupPosEventListeners();
  renderPosMenu();
  updatePosSale();
});

// Load menu and extras data
async function loadPosData() {
  // Define POS menu with your specific products and prices
  posMenu = [
    // Hamburguesas
    { id: 1, name: 'H. Asadera', category: 'hamburguesas', price: 63, base_ingredients: 'Carne+Q.Asadero' },
    { id: 2, name: 'H. Especial', category: 'hamburguesas', price: 63, base_ingredients: 'Carne+Carnes Frías' },
    { id: 3, name: 'H. Doble', category: 'hamburguesas', price: 60, base_ingredients: 'Carne+Jamón+Q.Amarillo' },
    { id: 4, name: 'H. Champiqueso', category: 'hamburguesas', price: 76, base_ingredients: 'Carne+Champiñón+Q.Asadero' },
    { id: 5, name: 'H. Petra', category: 'hamburguesas', price: 78, base_ingredients: 'Carne+Q.Asadero+Tocino' },
    { id: 6, name: 'H. Campechana', category: 'hamburguesas', price: 73, base_ingredients: 'Asadera+Jamón+Q.Amarillo' },
    { id: 7, name: 'H. Ejecutiva', category: 'hamburguesas', price: 95, base_ingredients: 'Carne+Carnes Frías+Salchicha' },
    { id: 8, name: 'H. Española', category: 'hamburguesas', price: 95, base_ingredients: 'Carne+Q.Asadero+Salchicha' },
    { id: 9, name: 'H. Embajadora', category: 'hamburguesas', price: 108, base_ingredients: 'Carne+Carnes Frías+Q.Asadero+Salchicha' },
    { id: 10, name: 'H. Americana', category: 'hamburguesas', price: 100, base_ingredients: 'Doble Carne+Doble Q.Amarillo' },
    { id: 11, name: 'H. Choriqueso', category: 'hamburguesas', price: 45, base_ingredients: 'Chorizo+Q.Asadero' },
    { id: 12, name: 'H. Ranchera', category: 'hamburguesas', price: 76, base_ingredients: 'Carne+Chorizo+Q.Asadero' },
    { id: 13, name: 'H. Hawaiana', category: 'hamburguesas', price: 76, base_ingredients: 'Carne+Piña+Q.Asadero' },
    { id: 14, name: 'H. Hawaiana Especial', category: 'hamburguesas', price: 89, base_ingredients: 'Carne+Piña+Q.Asadero+Carnes Frías' },
    { id: 15, name: 'H. Especial Asadera', category: 'hamburguesas', price: 76, base_ingredients: 'Carne+Q.Asadero+Carnes Frías' },
    { id: 16, name: 'H. Ahumada', category: 'hamburguesas', price: 50, base_ingredients: 'Chuleta' },
    { id: 17, name: 'H. Ahumada Especial', category: 'hamburguesas', price: 63, base_ingredients: 'Chuleta+Carnes Frías' },
    { id: 18, name: 'H. Mexicana', category: 'hamburguesas', price: 84, base_ingredients: 'Chuleta+Carne' },
    { id: 19, name: 'H. Norteña', category: 'hamburguesas', price: 97, base_ingredients: 'Carne+Chuleta+Q.Asadero' },
    { id: 20, name: 'H. Italiana', category: 'hamburguesas', price: 63, base_ingredients: 'Chuleta+Q.Asadero' },
    { id: 21, name: 'H. Extravagante', category: 'hamburguesas', price: 110, base_ingredients: 'Carne+Chuleta+Q.Asadero+Carnes Frías' },
    { id: 22, name: 'H. Descarnada', category: 'hamburguesas', price: 48, base_ingredients: 'Carnes Frías+Q.Amarillo' },
    { id: 23, name: 'H. Descarnada Asadero', category: 'hamburguesas', price: 61, base_ingredients: 'Carnes Frías+Q.Amarillo+Q.Asadero' },
    { id: 24, name: 'H. Sencilla', category: 'hamburguesas', price: 50, base_ingredients: 'Carne de Res' },
    { id: 25, name: 'H. Big Sencilla', category: 'hamburguesas', price: 84, base_ingredients: '2 Carnes de Res' },
    { id: 26, name: 'H. Costeña', category: 'hamburguesas', price: 96, base_ingredients: 'Camarón+Q.Asadero+Tocino+Ch.Morrón+Sal.Inglesa' },
    { id: 27, name: 'H. Super Costeña', category: 'hamburguesas', price: 130, base_ingredients: 'Camarón+Q.Asadero+Carne de Res+Tocino+Ch.Morrón' },
    { id: 28, name: 'H. La Popotiña', category: 'hamburguesas', price: 82, base_ingredients: 'Carne de Pierna+Tocino+Chile Morrón+Q.Asadero' },
    { id: 29, name: 'H. Grosera', category: 'hamburguesas', price: 60, base_ingredients: 'Salchicha para Asar+Q.Asadero+Tocino' },
    { id: 30, name: 'H. Super Grosera', category: 'hamburguesas', price: 94, base_ingredients: 'Salchicha para Asar+Q.Asadero+Tocino+Carne de Res' },
    
    // Hotdogs
    { id: 31, name: 'D. Dogo de Pavo', category: 'hotdogs', price: 50, base_ingredients: 'Salchicha de Pavo' },
    { id: 32, name: 'D. Grosero', category: 'hotdogs', price: 60, base_ingredients: 'Salchicha para Asar+Q.Asadero+Tocino Rebanado' },
    { id: 33, name: 'D. Asadero', category: 'hotdogs', price: 63, base_ingredients: 'Salchicha+Q.Asadero' },
    { id: 34, name: 'D. Big Grosero', category: 'hotdogs', price: 76, base_ingredients: 'Grosero+Carnes Frías' },
    { id: 35, name: 'D. Choriqueso', category: 'hotdogs', price: 76, base_ingredients: 'Salchicha+Chorizo+Q.Asadero' },
    { id: 36, name: 'D. Champiqueso', category: 'hotdogs', price: 73, base_ingredients: 'Salchicha+Champiñones+Q.Asadero' },
    { id: 37, name: 'D. Campechano', category: 'hotdogs', price: 73, base_ingredients: 'Asadero+Jamón+Q.Amarillo' },
    { id: 38, name: 'D. Especial', category: 'hotdogs', price: 63, base_ingredients: 'Salchicha+C.Frías' },
    { id: 39, name: 'D. Hawaiano', category: 'hotdogs', price: 76, base_ingredients: 'Salchicha+Q.Asadero+Piña' },
    { id: 40, name: 'D. Hawaiano Especial', category: 'hotdogs', price: 89, base_ingredients: 'Salchicha+Q.Asadero+Piña+C.Frías' },
    { id: 41, name: 'D. Doble', category: 'hotdogs', price: 60, base_ingredients: 'Salchicha+Jamón+Q.Amarillo' },
    { id: 42, name: 'D. Descarnado', category: 'hotdogs', price: 48, base_ingredients: 'Jamón+Pastel+Q.de Puerco+Mortadela+Salami' },
    { id: 43, name: 'D. de Pierna', category: 'hotdogs', price: 48, base_ingredients: 'Salchicha de Pierna' },
    
    // Sincronizadas
    { id: 44, name: 'S. Sencilla', category: 'sincronizadas', price: 51, base_ingredients: 'T.Harina+Jamón+Q.Asadero+Q.Amarillo' },
    { id: 45, name: 'S. Especial', category: 'sincronizadas', price: 81, base_ingredients: 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Pierna' },
    { id: 46, name: 'S. Super', category: 'sincronizadas', price: 64, base_ingredients: 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Champiñones' },
    { id: 47, name: 'S. Matona', category: 'sincronizadas', price: 125, base_ingredients: 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Pierna+Salchicha Grosera' },
    { id: 48, name: 'S. Costeña', category: 'sincronizadas', price: 125, base_ingredients: 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Camarón+Pierna' },
    
    // Tortas
    { id: 49, name: 'T. Sencilla', category: 'tortas', price: 50, base_ingredients: 'Telera+Pierna' },
    { id: 50, name: 'T. Especial', category: 'tortas', price: 63, base_ingredients: 'Carnes Frías+Pierna' },
    { id: 51, name: 'T. Asadera', category: 'tortas', price: 63, base_ingredients: 'Pierna+Q.Asadero' },
    { id: 52, name: 'T. Cubana', category: 'tortas', price: 101, base_ingredients: 'Jamón+Q.Asadero+Salchicha+Pierna' },
    
    // Burros
    { id: 53, name: 'B. Sencillo', category: 'burros', price: 50, base_ingredients: 'Carne de Pierna' },
    { id: 54, name: 'B. Asadero', category: 'burros', price: 63, base_ingredients: 'Carne de Pierna+Q.Asadero' },
    { id: 55, name: 'B. Especial', category: 'burros', price: 63, base_ingredients: 'Carne de Pierna+Carnes Frías' },
    { id: 56, name: 'B. Costeño', category: 'burros', price: 106, base_ingredients: 'Carne de Pierna+Camarón+Q.Asadero' },
    
    // Extras
    { id: 101, name: 'Carne', category: 'extras', price: 34, base_ingredients: 'Carne adicional' },
    { id: 102, name: 'Carnes Frías', category: 'extras', price: 13, base_ingredients: 'Carnes frías adicionales' },
    { id: 103, name: 'Q. Asadero', category: 'extras', price: 13, base_ingredients: 'Queso asadero' },
    { id: 104, name: 'Salchicha para Asar', category: 'extras', price: 44, base_ingredients: 'Salchicha para asar' },
    { id: 105, name: 'Piña', category: 'extras', price: 13, base_ingredients: 'Piña natural' },
    { id: 106, name: 'Champiñón', category: 'extras', price: 13, base_ingredients: 'Champiñones' },
    { id: 107, name: 'Salchicha de Pavo', category: 'extras', price: 34, base_ingredients: 'Salchicha de pavo' },
    { id: 108, name: 'Chuleta', category: 'extras', price: 34, base_ingredients: 'Chuleta' },
    { id: 109, name: 'Camarón', category: 'extras', price: 46, base_ingredients: 'Camarón' },
    { id: 110, name: 'Tocino', category: 'extras', price: 15, base_ingredients: 'Tocino' },
    { id: 111, name: 'Carne de Pierna', category: 'extras', price: 34, base_ingredients: 'Carne de pierna' },
    { id: 112, name: 'Chorizo', category: 'extras', price: 13, base_ingredients: 'Chorizo' },
    { id: 113, name: 'Q. Amarillo', category: 'extras', price: 10, base_ingredients: 'Queso amarillo' },
    
    // Bebidas y Papas
    { id: 201, name: 'Bebidas', category: 'bebidas', price: 30, base_ingredients: 'Aguas y refrescos' },
    { id: 202, name: 'Papas Chicas', category: 'papas', price: 45, base_ingredients: 'Papas fritas chicas' },
    { id: 203, name: 'Papas Grandes', category: 'papas', price: 50, base_ingredients: 'Papas fritas grandes' }
  ];
  
  console.log('POS Menu loaded:', posMenu.length, 'items');
}

// Setup event listeners
function setupPosEventListeners() {
  // Category buttons
  document.querySelectorAll('.pos-category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pos-category-btn').forEach(b => {
        b.className = b.className.replace('bg-green-500 text-white', 'bg-gray-600 text-gray-300');
      });
      this.className = this.className.replace('bg-gray-600 text-gray-300', 'bg-green-500 text-white');
      
      posCurrentCategory = this.dataset.category;
      renderPosMenu();
    });
  });
  
  // Beverage controls
  document.getElementById('pos-beverage-decrease').addEventListener('click', () => {
    if (posBeverageCount > 0) {
      posBeverageCount--;
      updatePosBeverageDisplay();
      updatePosSale();
    }
  });
  
  document.getElementById('pos-beverage-increase').addEventListener('click', () => {
    posBeverageCount++;
    updatePosBeverageDisplay();
    updatePosSale();
  });
  
  // Action buttons
  document.getElementById('pos-clear-sale').addEventListener('click', clearPosSale);
  document.getElementById('pos-complete-sale').addEventListener('click', completeSale);
  
  // Modal controls
  document.getElementById('pos-new-sale').addEventListener('click', function() {
    closePosSaleModal();
    clearPosSale();
  });
  
  document.getElementById('pos-print-receipt').addEventListener('click', printReceipt);
}

// Render menu for current category
function renderPosMenu() {
  const container = document.getElementById('pos-menu-grid');
  
  const categoryItems = posMenu.filter(item => item.category === posCurrentCategory);
  
  if (categoryItems.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-400 py-8 col-span-full">
        <p>No hay productos en esta categoría</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  
  categoryItems.forEach(item => {
    html += `
      <div class="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:bg-gray-600 cursor-pointer transition-colors"
           onclick="addToPosSale(${item.id})">
        <div class="text-center">
          <h3 class="font-bold text-white text-sm mb-1">${item.name}</h3>
          <p class="text-xs text-gray-300 mb-2 h-8 overflow-hidden">${item.base_ingredients}</p>
          <p class="font-bold text-green-400">$${item.price}</p>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Add product to current sale
function addToPosSale(itemId) {
  const menuItem = posMenu.find(item => item.id === itemId);
  if (!menuItem) return;
  
  // Check if item already exists in sale
  const existingItem = posSale.find(item => item.menu_item.id === itemId);
  
  if (existingItem) {
    existingItem.quantity++;
    existingItem.total_price = existingItem.menu_item.price * existingItem.quantity;
  } else {
    const saleItem = {
      menu_item: menuItem,
      quantity: 1,
      total_price: menuItem.price,
      extras: [] // POS doesn't handle extras for simplicity
    };
    
    posSale.push(saleItem);
  }
  
  updatePosSale();
  
  // Visual feedback
  const productElement = event.target.closest('.bg-gray-700');
  if (productElement) {
    productElement.classList.add('bg-green-600');
    setTimeout(() => {
      productElement.classList.remove('bg-green-600');
    }, 200);
  }
}

// Update POS sale display
function updatePosSale() {
  const saleContainer = document.getElementById('pos-sale-items');
  const totalElement = document.getElementById('pos-total');
  const itemCountElement = document.getElementById('pos-item-count');
  
  let total = 0;
  let totalItems = 0;
  
  if (posSale.length === 0 && posBeverageCount === 0) {
    saleContainer.innerHTML = `
      <div class="text-gray-400 text-center py-4 text-sm">
        Sin productos agregados
      </div>
    `;
    totalElement.textContent = '$0';
    if (itemCountElement) itemCountElement.textContent = '0';
    return;
  }
  
  let html = '';
  
  // Sale items
  posSale.forEach((item, index) => {
    total += item.total_price;
    totalItems += item.quantity;
    
    html += `
      <div class="flex justify-between items-center bg-gray-700 p-2 rounded text-sm">
        <div class="flex-1">
          <div class="font-semibold text-white">${item.quantity}x ${item.menu_item.name}</div>
          <div class="text-xs text-gray-300">${item.menu_item.base_ingredients}</div>
        </div>
        <div class="text-right ml-2">
          <div class="font-bold text-green-400">$${item.total_price}</div>
          <button class="text-red-400 hover:text-red-300 text-xs" onclick="removeFromPosSale(${index})">
            🗑️
          </button>
        </div>
      </div>
    `;
  });
  
  // Beverages in POS are handled separately but could be integrated
  if (posBeverageCount > 0) {
    const beverageTotal = posBeverageCount * 30;
    total += beverageTotal;
    totalItems += posBeverageCount;
  }
  
  saleContainer.innerHTML = html;
  totalElement.textContent = `$${total}`;
  if (itemCountElement) itemCountElement.textContent = totalItems;
}

// Remove item from POS sale
function removeFromPosSale(index) {
  posSale.splice(index, 1);
  updatePosSale();
}

// Update beverage display
function updatePosBeverageDisplay() {
  document.getElementById('pos-beverage-count').textContent = posBeverageCount;
}

// Clear current sale
function clearPosSale() {
  posSale = [];
  posBeverageCount = 0;
  updatePosBeverageDisplay();
  updatePosSale();
  
  // Also update item count
  const itemCountElement = document.getElementById('pos-item-count');
  if (itemCountElement) itemCountElement.textContent = '0';
}

// Complete sale
function completeSale() {
  if (posSale.length === 0 && posBeverageCount === 0) {
    alert('⚠️ No hay productos en la venta actual');
    return;
  }
  
  const total = calculateSaleTotal();
  const summary = generateSaleSummary(total);
  
  document.getElementById('pos-sale-summary').textContent = summary;
  document.getElementById('pos-sale-modal').classList.remove('hidden');
}

// Calculate sale total
function calculateSaleTotal() {
  let total = 0;
  
  posSale.forEach(item => {
    total += item.total_price;
  });
  
  if (posBeverageCount > 0) {
    total += posBeverageCount * 30;
  }
  
  return total;
}

// Generate sale summary text
function generateSaleSummary(total) {
  let summary = `💰 RESUMEN DE VENTA\n`;
  summary += `🕐 ${new Date().toLocaleDateString('es-MX')} - ${new Date().toLocaleTimeString('es-MX')}\n\n`;
  
  summary += `📋 PRODUCTOS:\n`;
  
  posSale.forEach(item => {
    summary += `${item.quantity}x ${item.menu_item.name} - $${item.total_price}\n`;
    if (item.menu_item.base_ingredients) {
      summary += `   ${item.menu_item.base_ingredients}\n`;
    }
    summary += `\n`;
  });
  
  if (posBeverageCount > 0) {
    summary += `${posBeverageCount}x Aguas y Refrescos - $${posBeverageCount * 30}\n\n`;
  }
  
  summary += `💵 TOTAL: $${total}\n`;
  summary += `\n¡Gracias por su compra! 🎉`;
  
  return summary;
}

// Print receipt (simulate printing)
function printReceipt() {
  const summary = document.getElementById('pos-sale-summary').textContent;
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Recibo - George Burger</title>
        <style>
          body { 
            font-family: monospace; 
            margin: 20px; 
            white-space: pre-line;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        🍔 GEORGE BURGER 🍔
        =====================
        
        ${summary}
        
        =====================
        Sistema POS v1.0
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
}

// Close sale modal
function closePosSaleModal() {
  document.getElementById('pos-sale-modal').classList.add('hidden');
}

// Show notification
function showPosNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-600' : 
    type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  } text-white`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}