const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { success, error } = require('../utils/api.response');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return error(res, 'E01', '❌ El correo electrónico ya está registrado.', 400);
    }

    await User.create({ name, email, password, role, branchId });
    return success(res, {}, '✅ Usuario registrado exitosamente.', 201);

  } catch (err) {
    console.error('❌ Error registrando usuario:', err);
    return error(res, 'E99', '❌ Error interno del servidor.', 500);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return error(res, 'E01', '❌ Correo o contraseña incorrectos.', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'E01', '❌ Correo o contraseña incorrectos.', 400);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, branchId: user.branch_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );    

    return success(res, { token }, '✅ Inicio de sesión exitoso.');
  } catch (err) {
    console.error('❌ Error en login:', err);
    return error(res, 'E99', '❌ Error interno del servidor.', 500);
  }
};

