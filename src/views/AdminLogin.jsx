export const AdminLogin = () => {
  return (
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
}
