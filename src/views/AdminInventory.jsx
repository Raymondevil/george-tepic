export const AdminInventory = () => {
  return (
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
}
