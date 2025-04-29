const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {};

// Create a new user
User.create = async ({ name, email, password, role, branchId }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role, branch_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, role, branchId]
  );
  return result;
};

// Find a user by email
User.findByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

module.exports = User;
