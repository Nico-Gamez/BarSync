const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const Product = require("../models/product.model");
const { success, error } = require("../utils/api.response");

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { name, cost, price, stock } = req.body;

    if (!name || !cost || !price || !stock) {
      return error(res, "E87", "❌ Todos los campos son obligatorios.", 400);
    }

    const result = await Product.create(name, cost, price, stock);
    return success(res, result, "✅ Producto creado para todas las sedes.");
  } catch (err) {
    console.error("❌ Error creando producto:", err);
    return error(res, "E80", "Error creando producto.", 500);
  }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const user = req.user;
    const isAdmin = user.role === "admin";
    const branchId = isAdmin ? req.query.branchId : user.branchId;

    if (!branchId) {
      return error(res, "E88", "❌ Sucursal no especificada.", 400);
    }

    const products = await Product.findAll(branchId);
    return success(res, products, "✅ Listado de productos.");
  } catch (err) {
    console.error("❌ Error listando productos:", err);
    return error(res, "E81", "Error listando productos.", 500);
  }
};

// 🔥 Nuevo flujo: Actualizar solo los campos que llegan
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Todo el body serán los campos a actualizar

    if (!id || Object.keys(updates).length === 0) {
      return error(
        res,
        "E82",
        "❌ ID o datos para actualizar son inválidos.",
        400
      );
    }

    const result = await Product.update(id, updates);
    return success(res, result, "✅ Producto actualizado exitosamente.");
  } catch (err) {
    console.error("❌ Error actualizando producto:", err);
    return error(res, "E82", "❌ Error actualizando producto.", 500);
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.delete(id);
    return success(res, result, "✅ Producto eliminado exitosamente.");
  } catch (err) {
    console.error("❌ Error eliminando producto:", err);
    return error(res, "E83", "Error eliminando producto.", 500);
  }
};

exports.downloadFilteredProductReport = async (req, res) => {
  try {
    const { format = "xlsx", startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return error(
        res,
        "E85",
        "❌ Debes proporcionar startDate y endDate.",
        400
      );
    }

    const user = req.user;
    const isAdmin = user.role === "admin";

    // ✅ Para admins usamos el branchId del query, si viene
    const branchId = isAdmin ? req.query.branchId : user.branchId;

    const products = await Product.getReportByDateAndBranch({
      startDate,
      endDate,
      branchId,
      isAdmin,
    });

    // Agrupar por ID + Costo + Precio Venta
    const grouped = {};

    for (const p of products) {
      const key = `${p.id}_${p.cost_at_sale}_${p.sale_price}`;

      if (!grouped[key]) {
        grouped[key] = {
          "ID Producto": p.id,
          "Nombre Producto": p.name,
          "Cantidad Vendida": Number(p.quantity),
          "Precio Compra": Number(p.cost_at_sale),
          "Precio Venta": Number(p.sale_price),
          "Ganancia Total": Number(p.profit || 0),
          Sede: p.branch_name,
        };
      } else {
        grouped[key]["Cantidad Vendida"] += Number(p.quantity);
        grouped[key]["Ganancia Total"] += Number(p.profit || 0);
      }
    }

    // CSV: reemplazar puntos por comas, usar punto y coma como delimitador
    if (format === "csv") {
      const csvData = Object.values(grouped).map((p) => ({
        "ID Producto": p["ID Producto"],
        "Nombre Producto": p["Nombre Producto"],
        "Cantidad Vendida": p["Cantidad Vendida"],
        "Precio Compra": p["Precio Compra"].toFixed(2).replace(".", ","),
        "Precio Venta": p["Precio Venta"].toFixed(2).replace(".", ","),
        "Ganancia Total": p["Ganancia Total"].toFixed(2).replace(".", ","),
        Sede: p["Sede"],
      }));

      const parser = new Parser({ delimiter: ";" });
      const csv = parser.parse(csvData);
      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment("reporte_productos_filtrado.csv");
      return res.send("\uFEFF" + csv); // ✅ BOM UTF-8
    }

    // XLSX: dejar como números reales
    const reportData = Object.values(grouped).map((p) => ({
      "ID Producto": p["ID Producto"],
      "Nombre Producto": p["Nombre Producto"],
      "Cantidad Vendida": p["Cantidad Vendida"],
      "Precio Compra": p["Precio Compra"],
      "Precio Venta": p["Precio Venta"],
      "Ganancia Total": p["Ganancia Total"],
      Sede: p["Sede"],
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de Productos Vendidos");

    worksheet.columns = Object.keys(reportData[0]).map((key) => ({
      header: key,
      key,
    }));
    worksheet.addRows(reportData);

    res.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.attachment("reporte_productos_filtrado.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error generando reporte filtrado:", err);
    return error(res, "E86", "Error generando reporte filtrado.", 500);
  }
};
