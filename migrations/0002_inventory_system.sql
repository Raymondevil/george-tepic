-- Sistema de inventario y administración

-- Tabla de sesiones administrativas (autenticación simple)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_token TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  ip_address TEXT
);

-- Tabla de inventario
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  quantity_sent INTEGER DEFAULT 0, -- Cantidad enviada/recibida
  quantity_remaining INTEGER DEFAULT 0, -- Cantidad restante al final del día
  total_stock INTEGER DEFAULT 0, -- Total en existencia
  category TEXT DEFAULT 'general', -- Categoría del producto
  unit TEXT DEFAULT 'piezas', -- Unidad de medida
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de movimientos de inventario (historial)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL,
  movement_type TEXT NOT NULL CHECK(movement_type IN ('entrada', 'salida', 'ajuste')),
  quantity INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

-- Tabla de cálculos diarios (para la calculadora)
CREATE TABLE IF NOT EXISTS daily_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  calculation_data TEXT, -- JSON con los datos del día
  total_sales DECIMAL(10,2) DEFAULT 0,
  expenses DECIMAL(10,2) DEFAULT 0,
  profit DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_inventory_id ON inventory_movements(inventory_id);
CREATE INDEX IF NOT EXISTS idx_daily_calculations_date ON daily_calculations(date);