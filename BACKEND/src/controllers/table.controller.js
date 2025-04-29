const Table = require('../models/table.model');
const { success, error } = require('../utils/api.response');

// Crear mesa
exports.createTable = async (req, res) => {
  try {
    const { table_number, status } = req.body;
    const branchId = req.user.branchId;

    if (!table_number || !branchId) {
      return error(res, 'E80', '❌ Número de mesa o sucursal no válidos.', 400);
    }

    const result = await Table.create(table_number, status, branchId);
    return success(res, { id: result.insertId }, '✅ Mesa creada.');
  } catch (err) {
    console.error('❌ Error creando mesa:', err);
    return error(res, 'E99', 'Error del servidor al crear mesa.', 500);
  }
};

// Obtener todas las mesas
exports.getAllTables = async (req, res) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return error(res, 'E90', '❌ Debes proporcionar el branchId.', 400);
    }

    const tables = await Table.findByBranch(branchId);
    return success(res, tables, '✅ Listado de mesas.');
  } catch (err) {
    console.error('❌ Error listando mesas:', err);
    return error(res, 'E91', '❌ Error listando mesas.', 500);
  }
};


// Cambiar estado de una mesa
exports.updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await Table.updateStatus(id, status);
    return success(res, result, '✅ Estado de mesa actualizado correctamente.');
  } catch (err) {
    console.error('❌ Error actualizando estado de mesa:', err);
    return error(res, 'E62', 'Error actualizando estado de mesa.', 500);
  }
};

// Asignar una mesa como ocupada
exports.assignTable = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Table.assign(id);
    return success(res, result, '✅ Mesa asignada correctamente.');
  } catch (err) {
    console.error('❌ Error asignando mesa:', err);
    return error(res, 'E63', 'Error asignando mesa.', 500);
  }
};

// Eliminar una mesa
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Table.delete(id);
    return success(res, result, '✅ Mesa eliminada exitosamente.');
  } catch (err) {
    console.error('❌ Error eliminando mesa:', err);
    return error(res, 'E64', 'Error eliminando mesa.', 500);
  }
};

exports.getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM tables WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ Error obteniendo mesa por ID:', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


