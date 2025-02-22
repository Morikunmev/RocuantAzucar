import { pool } from "../db.js";

export const getAllMovimientos = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as cliente_nombre 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.created_by = $1 
       ORDER BY m.fecha ASC, m.id_movimiento ASC`, // Modificado para orden cronológico
      [req.userId]
    );
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createMovimiento = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      fecha,
      numero_factura,
      id_cliente,
      tipo_movimiento,
      valor_kilo,
      ingreso_kilos,
      egreso_kilos,
      utilidad_neta,
      utilidad_total,
    } = req.body;

    // Para movimientos de tipo 'Ajuste'
    if (tipo_movimiento === "Ajuste") {
      const result = await client.query(
        `INSERT INTO movimientos (
          fecha,
          tipo_movimiento,
          stock_kilos,
          created_by
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
        [fecha, tipo_movimiento, req.body.stock_kilos, req.userId]
      );

      await client.query("COMMIT");
      return res.json(result.rows[0]);
    }

    // Para movimientos normales (Compra/Venta)
    const processedData = {
      compra_azucar:
        tipo_movimiento === "Compra"
          ? Number(valor_kilo) * Number(ingreso_kilos)
          : null,
      venta_azucar:
        tipo_movimiento === "Venta"
          ? Number(valor_kilo) * Number(egreso_kilos)
          : null,
      valor_kilo: Number(valor_kilo),
      ingreso_kilos:
        tipo_movimiento === "Compra" ? Number(ingreso_kilos) : null,
      egreso_kilos: tipo_movimiento === "Venta" ? Number(egreso_kilos) : null,
      utilidad_neta: tipo_movimiento === "Venta" ? Number(utilidad_neta) : null,
      utilidad_total:
        tipo_movimiento === "Venta" ? Number(utilidad_total) : null,
    };

    const result = await client.query(
      `INSERT INTO movimientos (
        fecha, 
        numero_factura, 
        id_cliente, 
        tipo_movimiento,
        valor_kilo,
        ingreso_kilos,
        egreso_kilos,
        compra_azucar,
        venta_azucar,
        utilidad_neta,
        utilidad_total,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        fecha,
        numero_factura,
        id_cliente,
        tipo_movimiento,
        processedData.valor_kilo,
        processedData.ingreso_kilos,
        processedData.egreso_kilos,
        processedData.compra_azucar,
        processedData.venta_azucar,
        processedData.utilidad_neta,
        processedData.utilidad_total,
        req.userId,
      ]
    );

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
    console.error("Error en createMovimiento:", error);
    if (error.code === "23505") {
      return res.status(400).json({
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

    let result;

    // Para movimientos de tipo 'Ajuste'
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
             compra_azucar = NULL,
             venta_azucar = NULL,
             utilidad_neta = NULL,
             utilidad_total = NULL,
             updated_by = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id_movimiento = $5 AND created_by = $6
         RETURNING *`,
        [fecha, tipo_movimiento, stock_kilos, req.userId, id, req.userId]
      );
    } else {
      // Para movimientos normales (Compra/Venta)
      result = await client.query(
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
    }

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "No existe un movimiento con ese id",
      });
    }

    // Obtener el movimiento actualizado con el nombre del cliente
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
