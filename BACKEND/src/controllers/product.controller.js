const Product = require('../models/product.model');
const { success, error } = require('../utils/api.response');

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { name, cost, price, stock, branchId } = req.body;
    const result = await Product.create(name, cost, price, stock, branchId);
    return success(res, result, '✅ Producto creado exitosamente.');
  } catch (err) {
    console.error('❌ Error creando producto:', err);
    return error(res, 'E80', 'Error creando producto.', 500);
  }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return success(res, products, '✅ Listado de productos.');
  } catch (err) {
    console.error('❌ Error listando productos:', err);
    return error(res, 'E81', 'Error listando productos.', 500);
  }
};

// 🔥 Nuevo flujo: Actualizar solo los campos que llegan
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Todo el body serán los campos a actualizar

    if (!id || Object.keys(updates).length === 0) {
      return error(res, 'E82', '❌ ID o datos para actualizar son inválidos.', 400);
    }

    const result = await Product.update(id, updates);
    return success(res, result, '✅ Producto actualizado exitosamente.');
  } catch (err) {
    console.error('❌ Error actualizando producto:', err);
    return error(res, 'E82', '❌ Error actualizando producto.', 500);
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.delete(id);
    return success(res, result, '✅ Producto eliminado exitosamente.');
  } catch (err) {
    console.error('❌ Error eliminando producto:', err);
    return error(res, 'E83', 'Error eliminando producto.', 500);
  }
};
