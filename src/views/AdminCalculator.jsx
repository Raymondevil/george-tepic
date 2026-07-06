export const AdminCalculator = () => {
  return (
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
}
