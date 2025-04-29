const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Obtener todas las sedes (requiere token)
router.get('/', verifyToken, branchController.getAllBranches);

module.exports = router;
