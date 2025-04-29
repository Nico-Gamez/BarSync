const db = require('../config/db');

const Inventory = {};

Inventory.create = async (productId, branchId, quantity) => {
  const [result] = await db.query(
    'INSERT INTO inventory (product_id, branch_id, quantity) VALUES (?, ?, ?)',
    [productId, branchId, quantity]
  );
  return result;
};

Inventory.updateQuantity = async (productId, branchId, quantityChange) => {
  const [result] = await db.query(
    'UPDATE inventory SET quantity = quantity + ? WHERE product_id = ? AND branch_id = ?',
    [quantityChange, productId, branchId]
  );
  return result;
};

Inventory.findByProductAndBranch = async (productId, branchId) => {
  const [rows] = await db.query(
    'SELECT * FROM inventory WHERE product_id = ? AND branch_id = ?',
    [productId, branchId]
  );
  return rows[0];
};

module.exports = Inventory;
