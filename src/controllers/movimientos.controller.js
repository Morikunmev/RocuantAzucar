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

export const createMovimiento = async (req, res, next) => {
  try {
    // Primero, destructura y verifica los valores
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

    // Log para debug
    console.log("Valores recibidos:", {
      compra_azucar,
      venta_azucar,
      valor_kilo
    });

    // Asegúrate de que los valores numéricos sean números
    const processedData = {
      compra_azucar: tipo_movimiento === "Compra" ? Number(compra_azucar) : null,
      venta_azucar: tipo_movimiento === "Venta" ? Number(venta_azucar) : null,
      valor_kilo: Number(valor_kilo),
      ingreso_kilos: tipo_movimiento === "Compra" ? Number(ingreso_kilos) : null,
      egreso_kilos: tipo_movimiento === "Venta" ? Number(egreso_kilos) : null,
      stock_kilos: Number(stock_kilos),
      utilidad_neta: tipo_movimiento === "Venta" ? Number(utilidad_neta) : null,
      utilidad_total: tipo_movimiento === "Venta" ? Number(utilidad_total) : null,
    };

    // Log para verificar la conversión
    console.log("Valores procesados:", processedData);

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
        processedData.valor_kilo,
        processedData.ingreso_kilos,
        processedData.egreso_kilos,
        processedData.stock_kilos,
        processedData.compra_azucar,
        processedData.venta_azucar,
        processedData.utilidad_neta,
        processedData.utilidad_total,
        req.userId,
      ]
    );

    // Log del resultado
    console.log("Resultado de la inserción:", result.rows[0]);

    const movimientoConCliente = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.id_movimiento = $1`,
      [result.rows[0].id_movimiento]
    );

    return res.json(movimientoConCliente.rows[0]);
  } catch (error) {
    console.error("Error en createMovimiento:", error);
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Ya existe un movimiento con ese número de factura",
      });
    }
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

    // Obtener el movimiento actualizado con el nombre del cliente
    const movimientoConCliente = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.id_movimiento = $1`,
      [id]
    );

    return res.json(movimientoConCliente.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
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
