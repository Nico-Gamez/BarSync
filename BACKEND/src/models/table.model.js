const db = require('../config/db');

const Table = {};

// Crear mesa (nuevo: con branch_id obligatorio)
Table.create = async (tableNumber, status, branchId) => {
  const [result] = await db.query(
    'INSERT INTO tables (table_number, status, branch_id) VALUES (?, ?, ?)',
    [tableNumber, status, branchId]
  );
  return result;
};

Table.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM tables');
  return rows;
};

Table.findByBranch = async (branchId) => {
  const [rows] = await db.query(
    `SELECT tables.*, branches.name AS branch_name 
     FROM tables 
     JOIN branches ON tables.branch_id = branches.id 
     WHERE tables.branch_id = ?`,
    [branchId]
  );
  return rows;
};


// Actualizar estado de una mesa
Table.updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE tables SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};

// Asignar mesa como "occupied"
Table.assign = async (id) => {
  const [result] = await db.query(
    'UPDATE tables SET status = "occupied" WHERE id = ?',
    [id]
  );
  return result;
};

Table.delete = async (id) => {
  const [result] = await db.query(
    'DELETE FROM tables WHERE id = ?',
    [id]
  );
  return result;
};

module.exports = Table;
