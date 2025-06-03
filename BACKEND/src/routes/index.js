const express = require('express');
const metricsRoutes = require('./metrics.routes');
const router = express.Router();

// Routes
router.use('/auth', require('./auth.routes'));
router.use('/tables', require('./table.routes'));
router.use('/orders', require('./order.routes'));
router.use('/products', require('./product.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/branches', require('./branch.routes'));
router.use('/users', require('./user.routes'));
router.use('/metrics', metricsRoutes);

module.exports = router;
