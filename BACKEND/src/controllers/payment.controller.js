const Payment = require('../models/payment.model');
const { success, error } = require('../utils/api.response');

// Registrar pago y actualizar pedido
exports.createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, totalPaid } = req.body;
    const cashierId = req.user.id;

    await Payment.create(orderId, cashierId, paymentMethod, totalPaid);
    await Payment.updateOrderToPaid(orderId);

    return success(res, {}, '✅ Pago registrado y pedido actualizado a "paid".');
  } catch (err) {
    console.error('❌ Error creando el pago:', err);
    return error(res, 'E90', 'Error creando el pago.', 500);
  }
};

// Listar todos los pagos
exports.getAllPayments = async (req, res) => {
  try {
    const branchId = req.query.branchId ? Number(req.query.branchId) : null;

    const payments = await Payment.findAll(branchId);
    return success(res, payments, '✅ Listado de pagos.');
  } catch (err) {
    console.error('❌ Error listando los pagos:', err);
    return error(res, 'E91', 'Error listando los pagos.', 500);
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const details = await Payment.getPaymentDetails(orderId);
    return success(res, details, '✅ Detalles del pago.');
  } catch (err) {
    console.error('❌ Error obteniendo detalles del pago:', err);
    return error(res, 'E92', 'Error al obtener detalles del pago.', 500);
  }
};

