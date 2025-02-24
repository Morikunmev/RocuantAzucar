import { pool } from "../db.js";

export const getAllMovimientos = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.created_by = $1 
       ORDER BY m.fecha DESC, m.id_movimiento DESC`,
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
      return res.status(404).json({
        message: "Movimiento no encontrado",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
// En el archivo movimientos.controllers.js
export const createMovimiento = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      fecha,
      tipo_movimiento,
      stock_kilos,
      numero_factura,
      id_cliente,
      valor_kilo,
      ingreso_kilos,
      egreso_kilos,
      compra_azucar, // Añadimos estos campos
      venta_azucar, // Añadimos estos campos
      utilidad_neta,
      utilidad_total,
    } = req.body;

    let result;

    if (tipo_movimiento === "Ajuste") {
      result = await client.query(
        `INSERT INTO movimientos (
          fecha,
          tipo_movimiento,
          stock_kilos,
          created_by
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
        [fecha, tipo_movimiento, stock_kilos, req.userId]
      );
    } else {
      result = await client.query(
        `INSERT INTO movimientos (
          fecha,
          numero_factura,
          id_cliente,
          tipo_movimiento,
          valor_kilo,
          ingreso_kilos,
          egreso_kilos,
          compra_azucar,    -- Añadimos estos campos
          venta_azucar,     -- Añadimos estos campos
          utilidad_neta,
          utilidad_total,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          fecha,
          numero_factura,
          id_cliente,
          tipo_movimiento,
          valor_kilo,
          tipo_movimiento === "Compra" ? ingreso_kilos : null,
          tipo_movimiento === "Venta" ? egreso_kilos : null,
          tipo_movimiento === "Compra" ? compra_azucar : null, // Agregamos
          tipo_movimiento === "Venta" ? venta_azucar : null, // Agregamos
          tipo_movimiento === "Venta" ? utilidad_neta : null,
          tipo_movimiento === "Venta" ? utilidad_total : null,
          req.userId,
        ]
      );
    }

    const movimientoConCliente = await client.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.id_movimiento = $1`,
      [result.rows[0].id_movimiento]
    );

    await client.query("COMMIT");
    return res.json(movimientoConCliente.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un movimiento con ese número de factura",
      });
    }
    next(error);
  } finally {
    client.release();
  }
};

export const updateMovimiento = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const {
      fecha,
      tipo_movimiento,
      stock_kilos,
      numero_factura,
      id_cliente,
      valor_kilo,
      ingreso_kilos,
      egreso_kilos,
      utilidad_neta,
      utilidad_total,
    } = req.body;

    let result;

    if (tipo_movimiento === "Ajuste") {
      result = await client.query(
        `UPDATE movimientos 
         SET fecha = $1,
             tipo_movimiento = $2,
             stock_kilos = $3,
             numero_factura = NULL,
             id_cliente = NULL,
             valor_kilo = NULL,
             ingreso_kilos = NULL,
             egreso_kilos = NULL,
             utilidad_neta = NULL,
             utilidad_total = NULL,
             updated_by = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id_movimiento = $5 AND created_by = $6
         RETURNING *`,
        [fecha, tipo_movimiento, stock_kilos, req.userId, id, req.userId]
      );
    } else {
      result = await client.query(
        `UPDATE movimientos 
         SET fecha = $1,
             numero_factura = $2,
             id_cliente = $3,
             tipo_movimiento = $4,
             valor_kilo = $5,
             ingreso_kilos = $6,
             egreso_kilos = $7,
             utilidad_neta = $8,
             utilidad_total = $9,
             updated_by = $10,
             updated_at = CURRENT_TIMESTAMP
         WHERE id_movimiento = $11 AND created_by = $12
         RETURNING *`,
        [
          fecha,
          numero_factura,
          id_cliente,
          tipo_movimiento,
          valor_kilo,
          tipo_movimiento === "Compra" ? ingreso_kilos : null,
          tipo_movimiento === "Venta" ? egreso_kilos : null,
          tipo_movimiento === "Venta" ? utilidad_neta : null,
          tipo_movimiento === "Venta" ? utilidad_total : null,
          req.userId,
          id,
          req.userId,
        ]
      );
    }

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "No existe un movimiento con ese id",
      });
    }

    const movimientoConCliente = await client.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.id_movimiento = $1`,
      [id]
    );

    await client.query("COMMIT");
    return res.json(movimientoConCliente.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un movimiento con ese número de factura",
      });
    }
    next(error);
  } finally {
    client.release();
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
