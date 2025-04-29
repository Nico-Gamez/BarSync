const Order = require('../models/order.model');
const db = require('../config/db');
const { success, error } = require('../utils/api.response');

// 👉 Nuevo flujo: CREAR pedido SOLO cuando confirmamos

// Confirmar un pedido y crear en base de datos
exports.confirmOrder = async (req, res) => {
  const { tableId, products } = req.body;
  const waiterId = req.user.id;

  if (!products || products.length === 0) {
    return error(res, 'E75', '⚠️ No hay productos para crear el pedido.', 400);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Crear pedido como 'confirmed' directamente
    const [orderResult] = await connection.query(
      'INSERT INTO orders (waiter_id, table_id, status) VALUES (?, ?, "confirmed")',
      [waiterId, tableId]
    );
    const orderId = orderResult.insertId;

    // 2. Insertar productos en order_details
    for (const p of products) {
      await connection.query(
        'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, p.productId, p.quantity, p.unitPrice]
      );

      // 3. Actualizar inventario
      const [inventoryRows] = await connection.query(
        'SELECT id, quantity FROM inventory WHERE product_id = ? FOR UPDATE',
        [p.productId]
      );

      if (inventoryRows.length === 0) {
        throw new Error(`❌ Inventario no encontrado para el producto ID ${p.productId}`);
      }

      const inventory = inventoryRows[0];

      if (inventory.quantity < p.quantity) {
        throw new Error(`❌ Stock insuficiente para producto ID ${p.productId}`);
      }

      await connection.query(
        'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
        [p.quantity, inventory.id]
      );
    }

    await connection.commit();
    return success(res, { orderId }, '✅ Pedido creado y confirmado exitosamente.');
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error confirmando pedido:', err);
    return error(res, 'E72', 'Error confirmando pedido.', 500);
  } finally {
    connection.release();
  }
};

// Obtener todas las órdenes o filtradas por status
exports.getAllOrders = async (req, res) => {
  try {
    const status = req.query.status;

    let orders;
    if (status) {
      orders = await Order.findByStatus(status);
    } else {
      orders = await Order.findAll();
    }

    return success(res, orders, '✅ Listado de pedidos.');
  } catch (err) {
    console.error('❌ Error listando pedidos:', err);
    return error(res, 'E73', 'Error listando pedidos.', 500);
  }
};


// Eliminar un pedido (opcional si quieres mantenerlo)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Order.delete(id);
    return success(res, result, '✅ Pedido eliminado exitosamente.');
  } catch (err) {
    console.error('❌ Error eliminando pedido:', err);
    return error(res, 'E74', 'Error eliminando pedido.', 500);
  }
};

// Pagar un pedido
exports.payOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const result = await Order.pay(orderId);
    return success(res, result, '✅ Pedido pagado exitosamente.');
  } catch (err) {
    console.error('❌ Error pagando el pedido:', err);
    return error(res, 'E76', 'Error pagando el pedido.', 500);
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const [details] = await db.query(`
      SELECT 
        od.id,
        p.name AS product_name,
        od.quantity,
        od.unit_price,
        (od.quantity * od.unit_price) AS total
      FROM order_details od
      JOIN products p ON p.id = od.product_id
      WHERE od.order_id = ?
    `, [orderId]);

    res.status(200).json({
      success: true,
      data: details
    });
  } catch (err) {
    console.error('❌ Error obteniendo detalles del pedido:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

