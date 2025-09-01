--Se creo la base de datos llamada tecnostore_db
CREATE DATABASE tecnostore_db;

--Creación de la tabla de cotizaciones
CREATE TABLE cotizaciones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono  VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Creación de la tabla productos
CREATE TABLE productos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

--Creación de la tabla de productos cotizados
CREATE TABLE productos_cotizacion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotizacion_id INT,
    producto VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE
);

-- Insertar en la tabla productos el nombre del producto, precio unitario y cateogria
INSERT INTO productos (nombre, precio_unitario, categoria) VALUES
('Smartphones', 1200000.00, 'Tecnología'),
('Laptops', 2500000.00, 'Tecnología'),
('Audifonos', 250000.00, 'Accesorios'),
('Tablets', 1800000.00, 'Tecnología'),
('Consolas', 2200000.00, 'Entretenimiento'),
('Smartwatches', 900000.00, 'Tecnología'),
('Perifericos', 150000.00, 'Accesorios'),
('Impresoras', 600000.00, 'Oficina'),
('Accesorios', 80000.00, 'Accesorios')
ON DUPLICATE KEY UPDATE 
    precio_unitario = VALUES(precio_unitario),
    categoria = VALUES(categoria);
