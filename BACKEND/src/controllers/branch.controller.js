const Branch = require('../models/branch.model');
const { success, error } = require('../utils/api.response');

// GET /branches - Obtener todas las sedes
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll();
    return success(res, branches, '✅ Lista de sedes obtenida correctamente.');
  } catch (err) {
    console.error('❌ Error obteniendo sedes:', err);
    return error(res, 'E92', 'Error al obtener sedes.', 500);
  }
};
