const jwt = require('jsonwebtoken');

// 🔐 Middleware para verificar el token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '❌ No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: '❌ Token inválido.' });
    }
    req.user = decoded;
    next();
  });
};

// ✅ Middleware genérico para verificar uno o más roles
exports.hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: '⛔ No tienes permisos para realizar esta acción.' });
    }
    next();
  };
};

// ✅ Alias por claridad (opcional si preferís legibilidad en las rutas)
exports.isAdmin = exports.hasRole('admin');
exports.isWaiter = exports.hasRole('waiter');
exports.isCashier = exports.hasRole('cashier');
exports.isWaiterOrAdmin = exports.hasRole('waiter', 'admin');
exports.isCashierOrAdmin = exports.hasRole('cashier', 'admin');
