const db = require('../config/db');

const Branch = {};

Branch.findAll = async () => {
  const [rows] = await db.query('SELECT id, name, location FROM branches');
  return rows;
};

module.exports = Branch;
