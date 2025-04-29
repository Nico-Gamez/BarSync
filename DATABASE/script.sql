-- Create Database
CREATE DATABASE barsync;
USE barsync;

-- Table: branches
CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('waiter', 'cashier', 'admin') DEFAULT 'waiter',
    branch_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Table: tables
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL,
    status ENUM('free', 'occupied') DEFAULT 'free',
    branch_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Table: products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    branch_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Table: inventory
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    branch_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Table: orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    waiter_id INT NOT NULL,
    status ENUM('confirmed', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id),
    FOREIGN KEY (waiter_id) REFERENCES users(id)
);

-- Table: order_details
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table: payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    cashier_id INT NOT NULL,
    payment_method ENUM('cash', 'card', 'nequi', 'daviplata') NOT NULL,
    total_paid DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (cashier_id) REFERENCES users(id)
);



SELECT * FROM branches;
SELECT * FROM users;
SELECT * FROM tables;
SELECT * FROM orders;
SELECT * FROM order_details;
SELECT * FROM products;
SELECT * FROM inventory;
SELECT * FROM payments;

DELETE FROM users;
DELETE FROM branches;
DELETE FROM tables;
DELETE FROM products;
DELETE FROM inventory;
DELETE FROM orders;
DELETE FROM order_details;
ALTER TABLE products DROP COLUMN stock;


 -- Limpia las ramas anteriores

INSERT INTO branches (id, name, location) VALUES
(1, 'Chía', 'Chía, Cundinamarca'),
(2, 'Cota', 'Cota, Cundinamarca'),
(3, 'Zona T Bogotá', 'Zona T, Bogotá');


-- Usuario cajero
INSERT INTO users (name, email, password, role, branch_id)
VALUES ('Carlos Cajero', 'cashier@example.com', '123', 'cashier', 1);

-- Usuario mesero
INSERT INTO users (name, email, password, role, branch_id)
VALUES ('María Mesera', 'waiter@example.com', '123', 'waiter', 1);

-- Usuario admin
INSERT INTO users (name, email, password, role, branch_id)
VALUES ('Admin Master', 'admin@example.com', '123', 'admin', 1);


INSERT INTO tables (table_number, status, branch_id) VALUES
(1, 'free', 1),
(2, 'free', 1),
(3, 'occupied', 2);

INSERT INTO products (name, description, cost, price, stock, branch_id) VALUES
('Cerveza Poker', 'Cerveza tradicional.', 2000, 5000, 100, 1),
('Hamburguesa Clásica', 'Hamburguesa sencilla.', 4000, 12000, 50, 1),
('Agua Cristal', 'Agua embotellada.', 800, 2500, 200, 2);

INSERT INTO orders (table_id, waiter_id, status) VALUES
(1, 2, 'pending'),
(2, 2, 'confirmed');

INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 5000),
(1, 2, 1, 12000),
(2, 3, 1, 2500);

