const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// ✅ Registrar usuarios (solo admin)
router.post('/', verifyToken, isAdmin, userController.createUser);

// ✅ Obtener todos los usuarios (opcional: solo admin)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);


router.put('/:id/password', verifyToken, isAdmin, userController.changePassword);


module.exports = router;
