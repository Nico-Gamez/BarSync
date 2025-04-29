const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

// Ver todos los pagos (solo cajeros o admin)
router.get('/', verifyToken, hasRole('cashier', 'admin'), paymentController.getAllPayments);

// Registrar nuevo pago (solo cajeros)
router.post('/', verifyToken, hasRole('cashier', 'admin'), paymentController.createPayment);

router.get('/:orderId/details', verifyToken, hasRole('cashier', 'admin'), paymentController.getPaymentDetails);


module.exports = router;
