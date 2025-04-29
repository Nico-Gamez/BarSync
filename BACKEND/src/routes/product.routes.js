const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

// Solo admin puede crear, editar, eliminar productos
router.post('/', verifyToken, hasRole('admin'), productController.createProduct);
router.put('/:id', verifyToken, hasRole('admin', 'cashier'), productController.updateProduct);
router.delete('/:id', verifyToken, hasRole('admin'), productController.deleteProduct); 

// Todos los roles logueados pueden ver productos
router.get('/', verifyToken, productController.getAllProducts);

module.exports = router;
