export const Caja = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700">
      {/* Header */}
      <div className="bg-red-800 shadow-2xl border-b border-yellow-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-yellow-400">💰 CAJA DE COBRO</h1>
            <div className="space-x-4">
              <a href="/" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                🍔 Menú
              </a>
              <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                🔐 Admin
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Menu Grid - 3 columns */}
          <div className="xl:col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
                📋 PRODUCTOS DISPONIBLES
              </h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center mb-6 gap-2" id="pos-category-tabs">
                <button className="pos-category-btn active bg-yellow-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition text-sm" data-category="hamburguesas">
                  🍔 Hamburguesas
                </button>
                <button className="pos-category-btn bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition text-sm" data-category="hotdogs">
                  🌭 Hotdogs
                </button>
                <button className="pos-category-btn bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition text-sm" data-category="sincronizadas">
                  🌮 Sincronizadas
                </button>
                <button className="pos-category-btn bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition text-sm" data-category="tortas">
                  🥪 Tortas
                </button>
                <button className="pos-category-btn bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition text-sm" data-category="burros">
                  🌯 Burros
                </button>
                <button className="pos-category-btn bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition text-sm" data-category="papas">
                  🍟 Papas
                </button>
                <button className="pos-category-btn bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-semibold hover:bg-gray-500 transition text-sm" data-category="bebidas">
                  🥤 Bebidas
                </button>
              </div>

              {/* Product Grid */}
              <div id="pos-menu-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                <div className="text-center text-gray-400 py-8 col-span-full">
                  <p>Cargando productos...</p>
                </div>
              </div>
            </div>
          </div>

          {/* POS Panel - 1 column */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 sticky top-4">
              
              {/* Current Sale */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">🧾 Venta Actual</h3>
                
                {/* Sale Items */}
                <div id="pos-sale-items" className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  <div className="text-gray-400 text-center py-4 text-sm">
                    Sin productos agregados
                  </div>
                </div>
                
                {/* Beverages */}
                <div className="border-t border-gray-600 pt-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">🥤 Aguas/Refrescos</span>
                    <span className="text-gray-300 text-sm">$30 c/u</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <button id="pos-beverage-decrease" className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 text-sm">-</button>
                    <span id="pos-beverage-count" className="font-bold text-lg w-8 text-center">0</span>
                    <button id="pos-beverage-increase" className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600 text-sm">+</button>
                  </div>
                </div>
                
                {/* Items Count */}
                <div className="border-t border-gray-600 pt-3 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-400">Items:</span>
                    <span id="pos-item-count" className="text-lg font-bold text-yellow-400">0</span>
                  </div>
                </div>
                
                {/* Total */}
                <div className="border-t border-gray-600 pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-300">TOTAL:</span>
                    <span id="pos-total" className="text-2xl font-bold text-yellow-400">$0</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <button id="pos-clear-sale" className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold">
                    🗑️ Limpiar Venta
                  </button>
                  <button id="pos-complete-sale" className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition font-bold text-lg">
                    💵 Cobrar
                  </button>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* Sale Summary Modal */}
      <div id="pos-sale-modal" className="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4" style={{zIndex: 1000}}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-4">💰 Resumen de Venta</h3>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-4 text-left">
              <div id="pos-sale-summary" className="text-sm text-gray-300 whitespace-pre-line"></div>
            </div>
            
            <div className="flex space-x-3">
              <button id="pos-print-receipt" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                🖨️ Imprimir
              </button>
              <button id="pos-new-sale" className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                ✨ Nueva Venta
              </button>
            </div>
          </div>
        </div>
      </div>

      <script src="/static/pos.js"></script>
    </div>
  )
}
