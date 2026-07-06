export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gray-800 shadow-2xl border-b border-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-orange-400 mb-2">
                🍔 GEORGE BURGER 🍔
              </h1>
              <p className="text-gray-300">Hamburguesas, Hotdogs, Sincronizadas y más</p>
            </div>
            <div className="space-x-2">
              <a href="/caja" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm transition">
                💰 Caja
              </a>
              <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition">
                🔐 Admin
              </a>
            </div>
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

      {/* Floating Cart Indicator */}
      <div id="floating-cart" style={{display: 'none', position: 'fixed', top: '16px', right: '16px', background: '#ea580c', color: 'white', padding: '12px 16px', borderRadius: '9999px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: '50', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s ease'}}>
        🛒 <span id="cart-counter">0</span> | <span id="cart-total-indicator">$0</span>
      </div>

      <script src="/static/app.js"></script>
    </div>
  )
}
