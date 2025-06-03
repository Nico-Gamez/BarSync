const db = require('../config/db');
const Inventory = require('./inventory.model');
const Branch = require('./branch.model');

const Product = {};

Product.create = async (name, cost, price, initialQuantity) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 🔄 Obtener todas las sedes
    const branches = await Branch.findAll();

    const productIds = [];

    for (const branch of branches) {
      // 1. Crear el producto en cada branch
      const [productResult] = await conn.query(
        'INSERT INTO products (name, cost, price, branch_id) VALUES (?, ?, ?, ?)',
        [name, cost, price, branch.id]
      );
      const productId = productResult.insertId;

      // 2. Insertar inventario inicial
      await conn.query(
        'INSERT INTO inventory (product_id, branch_id, quantity) VALUES (?, ?, ?)',
        [productId, branch.id, initialQuantity]
      );

      productIds.push(productId);
    }

    await conn.commit();
    return { message: '✅ Producto creado en todas las sucursales.', productIds };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};



Product.findAll = async (branchId) => {
  const query = `
    SELECT 
      products.*, 
      branches.name AS branch_name, 
      branches.location AS branch_location,
      IFNULL(inventory.quantity, 0) AS stock
    FROM products
    JOIN branches ON products.branch_id = branches.id
    LEFT JOIN inventory ON products.id = inventory.product_id
    WHERE products.branch_id = ?
  `;
  const [rows] = await db.query(query, [branchId]);
  return rows;
};


Product.update = async (id, fieldsToUpdate) => {
  if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Actualizar producto si hay cambios
    const productFields = { ...fieldsToUpdate };
    delete productFields.stock; // quitamos stock para que no lo actualice en products

    if (Object.keys(productFields).length > 0) {
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(productFields)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }

      values.push(id); // WHERE id = ?

      const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
      await conn.query(sql, values);
    }

    // Actualizar inventario si mandaron stock
    if ('stock' in fieldsToUpdate) {
      const stock = fieldsToUpdate.stock;

      await conn.query(
        `UPDATE inventory
         SET quantity = ?
         WHERE product_id = ?`,
        [stock, id]
      );
    }

    await conn.commit();
    return { message: 'Producto actualizado' };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};



Product.delete = async (id) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Primero eliminar el inventario relacionado
    await conn.query('DELETE FROM inventory WHERE product_id = ?', [id]);

    // Luego eliminar el producto
    await conn.query('DELETE FROM products WHERE id = ?', [id]);

    await conn.commit();
    return { message: 'Producto e inventario eliminados correctamente' };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};


Product.getReportByDateAndBranch = async ({ startDate, endDate, branchId, isAdmin }) => {
  let whereBranch = '';
  let params = [startDate, endDate];

  if (isAdmin && branchId) {
    whereBranch = 'AND t.branch_id = ?';
    params.push(branchId);
  } else if (!isAdmin) {
    whereBranch = 'AND t.branch_id = ?';
    params.push(branchId);
  }

  const query = `
    SELECT
      p.id,
      p.name,
      od.quantity AS quantity,
      p.cost AS cost_at_sale,
      od.unit_price AS sale_price,
      (od.quantity * (od.unit_price - p.cost)) AS profit,
      b.name AS branch_name
    FROM payments pay
    JOIN orders o ON pay.order_id = o.id
    JOIN order_details od ON od.order_id = o.id
    JOIN products p ON p.id = od.product_id
    JOIN tables t ON o.table_id = t.id
    JOIN branches b ON t.branch_id = b.id
    WHERE DATE(pay.created_at) BETWEEN ? AND ?
    ${whereBranch}
  `;

  const [rows] = await db.query(query, params);
  return rows;
};



module.exports = Product;
