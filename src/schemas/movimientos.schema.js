import { pool } from "../db.js";

export const createMovimiento = async (req, res) => {
  const {
    fecha,
    numero_factura,
    id_cliente,
    tipo_movimiento,
    valor_kilo,
    stock_kilos,
    ingreso_kilos,
    egreso_kilos,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO movimientos (
        fecha, 
        numero_factura, 
        id_cliente, 
        tipo_movimiento, 
        valor_kilo, 
        stock_kilos, 
        ingreso_kilos, 
        egreso_kilos,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        fecha,
        numero_factura,
        id_cliente,
        tipo_movimiento,
        valor_kilo,
        stock_kilos,
        ingreso_kilos,
        egreso_kilos,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.constraint === "movimientos_numero_factura_key") {
      return res.status(400).json({
        message: "El número de factura ya existe",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getMovimientos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as nombre_cliente 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       ORDER BY m.fecha DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovimiento = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nombre as nombre_cliente 
       FROM movimientos m 
       LEFT JOIN clientes c ON m.id_cliente = c.id_cliente 
       WHERE m.id_movimiento = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMovimiento = async (req, res) => {
  const { id } = req.params;
  const {
    fecha,
    numero_factura,
    id_cliente,
    tipo_movimiento,
    valor_kilo,
    stock_kilos,
    ingreso_kilos,
    egreso_kilos,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE movimientos 
       SET fecha = COALESCE($1, fecha),
           numero_factura = COALESCE($2, numero_factura),
           id_cliente = COALESCE($3, id_cliente),
           tipo_movimiento = COALESCE($4, tipo_movimiento),
           valor_kilo = COALESCE($5, valor_kilo),
           stock_kilos = COALESCE($6, stock_kilos),
           ingreso_kilos = COALESCE($7, ingreso_kilos),
           egreso_kilos = COALESCE($8, egreso_kilos),
           updated_by = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id_movimiento = $10 
       RETURNING *`,
      [
        fecha,
        numero_factura,
        id_cliente,
        tipo_movimiento,
        valor_kilo,
        stock_kilos,
        ingreso_kilos,
        egreso_kilos,
        req.user.id,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.constraint === "movimientos_numero_factura_key") {
      return res.status(400).json({
        message: "El número de factura ya existe",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteMovimiento = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM movimientos WHERE id_movimiento = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
