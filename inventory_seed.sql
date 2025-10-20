-- Datos iniciales del inventario para George Burger

-- Panes y bases
INSERT OR IGNORE INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit) VALUES 
('Teleras', 50, 50, 50, 'panes', 'piezas'),
('Tortillas', 100, 100, 100, 'panes', 'piezas'),
('Bimbos', 30, 30, 30, 'panes', 'piezas');

-- Verduras y vegetales
INSERT OR IGNORE INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit) VALUES 
('Morrón', 5, 5, 5, 'verduras', 'kilos'),
('Piña', 2, 2, 2, 'verduras', 'kilos'),
('Champiñón', 3, 3, 3, 'verduras', 'kilos');

-- Carnes y proteínas
INSERT OR IGNORE INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit) VALUES 
('Carne', 10, 10, 10, 'carnes', 'kilos'),
('Carnes Frías', 5, 5, 5, 'carnes', 'kilos'),
('Salchicha para Asar', 8, 8, 8, 'carnes', 'kilos'),
('Salchicha de Pavo', 6, 6, 6, 'carnes', 'kilos'),
('Salchicha de Pierna', 6, 6, 6, 'carnes', 'kilos'),
('Chuleta', 7, 7, 7, 'carnes', 'kilos'),
('Camarón', 2, 2, 2, 'carnes', 'kilos'),
('Tocino', 4, 4, 4, 'carnes', 'kilos'),
('Carne de Pierna', 8, 8, 8, 'carnes', 'kilos'),
('Chorizo', 4, 4, 4, 'carnes', 'kilos');

-- Quesos
INSERT OR IGNORE INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit) VALUES 
('Q. Asadero', 6, 6, 6, 'quesos', 'kilos'),
('Q. Amarillo', 4, 4, 4, 'quesos', 'kilos');

-- Bebidas
INSERT OR IGNORE INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit) VALUES 
('Coca-Cola', 24, 24, 24, 'bebidas', 'latas'),
('Sprite', 24, 24, 24, 'bebidas', 'latas'),
('Fanta', 24, 24, 24, 'bebidas', 'latas'),
('Fresca', 24, 24, 24, 'bebidas', 'latas'),
('Agua de Jamaica', 10, 10, 10, 'bebidas', 'litros'),
('Agua de Horchata', 10, 10, 10, 'bebidas', 'litros');

-- Dinero en caja
INSERT OR IGNORE INTO inventory (name, quantity_sent, quantity_remaining, total_stock, category, unit) VALUES 
('Efectivo', 1000, 1000, 1000, 'dinero', 'pesos');