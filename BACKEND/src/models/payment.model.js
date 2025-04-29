const db = require('../config/db');

const Payment = {};

// Crear nuevo pago
Payment.create = async (orderId, cashierId, paymentMethod, totalPaid) => {
  const [result] = await db.query(
    'INSERT INTO payments (order_id, cashier_id, payment_method, total_paid) VALUES (?, ?, ?, ?)',
    [orderId, cashierId, paymentMethod, totalPaid]
  );
  return result;
};

// Actualizar pedido a "paid"
Payment.updateOrderToPaid = async (orderId) => {
  // 1. Cambiar estado del pedido a "paid"
  await db.query('UPDATE orders SET status = "paid" WHERE id = ?', [orderId]);

  // 2. Obtener el ID de la mesa usada en el pedido
  const [[{ table_id }]] = await db.query('SELECT table_id FROM orders WHERE id = ?', [orderId]);

  // 3. Liberar la mesa
  await db.query('UPDATE tables SET status = "free" WHERE id = ?', [table_id]);
};


// Listar pagos (opcionalmente por sucursal) incluyendo nombres
Payment.findAll = async (branchId = null) => {
  let query = `
    SELECT 
      p.id,
      p.order_id,
      p.payment_method,
      p.total_paid,
      p.created_at,
      t.table_number,
      u.name AS waiter_name,
      c.name AS cashier_name
    FROM payments p
    JOIN orders o ON p.order_id = o.id
    JOIN tables t ON o.table_id = t.id
    JOIN users u ON o.waiter_id = u.id
    JOIN users c ON p.cashier_id = c.id
  `;

  const params = [];

  if (branchId) {
    query += ` WHERE t.branch_id = ?`;
    params.push(branchId);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

Payment.getPaymentDetails = async (orderId) => {
  const [rows] = await db.query(`
    SELECT 
      p.name AS product_name,
      od.quantity,
      od.unit_price,
      (od.quantity * od.unit_price) AS total
    FROM order_details od
    JOIN products p ON p.id = od.product_id
    WHERE od.order_id = ?
  `, [orderId]);

  return rows;
};



module.exports = Payment;
