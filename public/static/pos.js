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
  try {
    const [menuResponse, extrasResponse] = await Promise.all([
      fetch('/api/menu'),
      fetch('/api/extras')
    ]);
    
    posMenu = await menuResponse.json();
    posExtras = await extrasResponse.json();
    
    // Add beverages as a special category
    posMenu.push({
      id: 999,
      name: 'Agua de Jamaica',
      category: 'bebidas',
      price: 30,
      base_ingredients: 'Bebida refrescante'
    });
    posMenu.push({
      id: 998,
      name: 'Agua de Horchata',
      category: 'bebidas', 
      price: 30,
      base_ingredients: 'Bebida refrescante'
    });
    posMenu.push({
      id: 997,
      name: 'Coca-Cola',
      category: 'bebidas',
      price: 30,
      base_ingredients: 'Refresco'
    });
    posMenu.push({
      id: 996,
      name: 'Sprite',
      category: 'bebidas',
      price: 30,
      base_ingredients: 'Refresco'
    });
    
    console.log('POS Menu loaded:', posMenu.length, 'items');
  } catch (error) {
    console.error('Error loading POS data:', error);
  }
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
  
  let total = 0;
  
  if (posSale.length === 0 && posBeverageCount === 0) {
    saleContainer.innerHTML = `
      <div class="text-gray-400 text-center py-4 text-sm">
        Sin productos agregados
      </div>
    `;
    totalElement.textContent = '$0';
    return;
  }
  
  let html = '';
  
  // Sale items
  posSale.forEach((item, index) => {
    total += item.total_price;
    
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
  }
  
  saleContainer.innerHTML = html;
  totalElement.textContent = `$${total}`;
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