const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

// Puedes proteger esto solo para admin si lo deseas
router.get('/', verifyToken, hasRole('admin'), metricsController.getSystemMetrics);

module.exports = router;
