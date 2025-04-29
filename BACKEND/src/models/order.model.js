const db = require('../config/db');

const Order = {};

// Crear pedido (encabezado)
Order.create = async (waiterId, tableId) => {
  const [result] = await db.query(
    'INSERT INTO orders (waiter_id, table_id, status) VALUES (?, ?, "confirmed")',
    [waiterId, tableId]
  );
  return result.insertId; // 🔥 Retornamos solo el ID directamente
};

// Agregar producto a pedido (detalle)
Order.addProduct = async (orderId, productId, quantity, unitPrice) => {
  const [result] = await db.query(
    'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, unitPrice]
  );
  return result;
};

// Actualizar inventario
Order.updateInventory = async (productId, quantity) => {
  const [rows] = await db.query(
    'SELECT id, quantity FROM inventory WHERE product_id = ? FOR UPDATE',
    [productId]
  );

  if (rows.length === 0) {
    throw new Error(`❌ No existe inventario para producto ID ${productId}`);
  }

  const inventory = rows[0];

  if (inventory.quantity < quantity) {
    throw new Error(`❌ Stock insuficiente para producto ID ${productId}`);
  }

  await db.query(
    'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
    [quantity, inventory.id]
  );
};

// Obtener todos los pedidos
Order.findAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      o.id, o.table_id, o.waiter_id, o.status, o.created_at,
      u.name AS waiter_name,
      t.table_number
    FROM orders o
    JOIN users u ON o.waiter_id = u.id
    JOIN tables t ON o.table_id = t.id
  `);
  return rows;
};

// Eliminar pedido
Order.delete = async (id) => {
  const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
  return result;
};

Order.pay = async (orderId) => {
  const [result] = await db.query(
    'UPDATE orders SET status = "paid" WHERE id = ?',
    [orderId]
  );
  return result;
};

Order.findByStatus = async (status) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE status = ?', [status]);
  return rows;
};


module.exports = Order;
