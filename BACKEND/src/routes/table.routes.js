const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

// Admin: crear, eliminar mesas
router.post('/', verifyToken, hasRole('admin'), tableController.createTable);
router.delete('/:id', verifyToken, hasRole('admin'), tableController.deleteTable);

// Waiter/Admin: cambiar estado de la mesa
router.put('/status/:id', verifyToken, hasRole('waiter', 'admin'), tableController.updateTableStatus);

// Waiter: asignar mesa
router.put('/assign/:id', verifyToken, hasRole('waiter'), tableController.assignTable);

// Todos los roles logueados pueden ver mesas
router.get('/', verifyToken, tableController.getAllTables);

router.get('/:id', verifyToken, tableController.getTableById);



module.exports = router;
