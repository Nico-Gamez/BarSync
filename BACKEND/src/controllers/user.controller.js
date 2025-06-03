const User = require('../models/user.model');
const { success, error } = require('../utils/api.response');

// Crear usuario (desde panel admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return error(res, 'E01', '❌ El correo electrónico ya está registrado.', 400);
    }

    await User.create({ name, email, password, role, branchId });
    return success(res, {}, '✅ Usuario creado exitosamente.', 201);
  } catch (err) {
    console.error('❌ Error creando usuario:', err);
    return error(res, 'E99', '❌ Error interno del servidor.', 500);
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    return success(res, users, '✅ Lista de usuarios cargada.');
  } catch (err) {
    console.error('❌ Error obteniendo usuarios:', err);
    return error(res, 'E99', '❌ Error interno del servidor.', 500);
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return error(res, 'E91', '❌ La nueva contraseña es obligatoria.', 400);
    }

    const result = await User.updatePassword(id, newPassword);
    return success(res, result, '✅ Contraseña actualizada correctamente.');
  } catch (err) {
    console.error('❌ Error actualizando contraseña:', err);
    return error(res, 'E92', 'Error actualizando contraseña.', 500);
  }
};

