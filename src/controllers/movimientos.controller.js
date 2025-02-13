import { pool } from "../db.js";

export const getAllMovimientos = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.created_by = $1 
       ORDER BY m.fecha DESC`,
      [req.userId]
    );
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getMovimiento = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.id_movimiento = $1 AND m.created_by = $2`,
      [req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
// En movimientos.controller.js
export const createMovimiento = async (req, res, next) => {
  try {
    // Verificar si ya existe una factura con ese número
    const facturaExistente = await pool.query(
      "SELECT * FROM movimientos WHERE numero_factura = $1",
      [req.body.numero_factura]
    );

    if (facturaExistente.rows.length > 0) {
      return res.status(400).json({
        message: "Ya existe un movimiento con ese número de factura",
      });
    }

    // Si no existe, proceder con la inserción
    const result = await pool.query(
      `INSERT INTO movimientos (
        fecha, 
        numero_factura, 
        id_cliente, 
        tipo_movimiento,
        valor_kilo,
        ingreso_kilos,
        egreso_kilos,
        stock_kilos,
        compra_azucar,
        venta_azucar,
        utilidad_neta,
        utilidad_total,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        fecha,
        numero_factura,
        id_cliente,
        tipo_movimiento,
        valor_kilo,
        ingreso_kilos,
        egreso_kilos,
        stock_kilos,
        compra_azucar,
        venta_azucar,
        utilidad_neta,
        utilidad_total,
        req.userId,
      ]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    // Manejar el error de restricción única
    if (error.code === "23505") {
      // Código PostgreSQL para violación de restricción única
      return res.status(400).json({
        message: "Ya existe un movimiento con ese número de factura",
      });
    }
    next(error);
  }
};

export const deleteMovimiento = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM movimientos WHERE id_movimiento = $1 AND created_by = $2 RETURNING *",
      [req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No existe un movimiento con ese id",
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const updateMovimiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fecha,
      numero_factura,
      id_cliente,
      tipo_movimiento,
      valor_kilo,
      ingreso_kilos,
      egreso_kilos,
      stock_kilos,
      compra_azucar,
      venta_azucar,
      utilidad_neta,
      utilidad_total,
    } = req.body;

    const result = await pool.query(
      `UPDATE movimientos 
       SET fecha = $1,
           numero_factura = $2,
           id_cliente = $3,
           tipo_movimiento = $4,
           valor_kilo = $5,
           ingreso_kilos = $6,
           egreso_kilos = $7,
           stock_kilos = $8,
           compra_azucar = $9,
           venta_azucar = $10,
           utilidad_neta = $11,
           utilidad_total = $12,
           updated_by = $13,
           updated_at = CURRENT_TIMESTAMP
       WHERE id_movimiento = $14 AND created_by = $15
       RETURNING *`,
      [
        fecha,
        numero_factura,
        id_cliente,
        tipo_movimiento,
        valor_kilo,
        tipo_movimiento === "Compra" ? ingreso_kilos : null,
        tipo_movimiento === "Venta" ? egreso_kilos : null,
        stock_kilos,
        tipo_movimiento === "Compra" ? compra_azucar : null,
        tipo_movimiento === "Venta" ? venta_azucar : null,
        tipo_movimiento === "Venta" ? utilidad_neta : null,
        tipo_movimiento === "Venta" ? utilidad_total : null,
        req.userId,
        id,
        req.userId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No existe un movimiento con ese id",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un movimiento con ese número de factura",
      });
    }
    next(error);
  }
};
