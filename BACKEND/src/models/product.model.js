const db = require('../config/db');
const Inventory = require('./inventory.model'); // Importamos Inventory

const Product = {};

Product.create = async (name, cost, price, initialQuantity, branchId) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Crear el producto
    const [productResult] = await conn.query(
      'INSERT INTO products (name, cost, price, branch_id) VALUES (?, ?, ?, ?)',
      [name, cost, price, branchId]
    );

    const productId = productResult.insertId;

    // 2. Crear el inventario inicial
    await conn.query(
      'INSERT INTO inventory (product_id, branch_id, quantity) VALUES (?, ?, ?)',
      [productId, branchId, initialQuantity]
    );

    await conn.commit();
    return { productId };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

Product.findAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      products.*, 
      branches.name AS branch_name, 
      branches.location AS branch_location,
      IFNULL(inventory.quantity, 0) AS stock
    FROM products
    JOIN branches ON products.branch_id = branches.id
    LEFT JOIN inventory ON products.id = inventory.product_id
  `);
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


module.exports = Product;
