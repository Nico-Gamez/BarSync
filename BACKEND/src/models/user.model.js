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

User.getAll = async () => {
  const [rows] = await db.query(
    `SELECT 
        users.id, 
        users.name, 
        users.email, 
        users.role, 
        users.created_at,
        branches.name AS branch
     FROM users
     JOIN branches ON users.branch_id = branches.id`
  );
  return rows;
};


User.updatePassword = async (userId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);
  return result;
};



module.exports = User;
