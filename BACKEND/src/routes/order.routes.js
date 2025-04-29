const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

// Crear y confirmar pedido (solo meseros o admin)
router.post('/', verifyToken, hasRole('waiter', 'admin'), orderController.confirmOrder);

// Obtener todos los pedidos (todos los roles pueden consultar si están logueados)
router.get('/', verifyToken, orderController.getAllOrders);

// Pagar pedido (solo cajeros o admin)
router.put('/:id/pay', verifyToken, hasRole('cashier', 'admin'), orderController.payOrder);

router.get('/:orderId/details', verifyToken, orderController.getOrderDetails);


module.exports = router;
