import { pool } from "../db.js";

export const getAllClientes = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clientes WHERE created_by = $1",
      [req.userId]
    );
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createCliente = async (req, res, next) => {
  const { nombre, tipo } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clientes (nombre, tipo, created_by) VALUES ($1, $2, $3) RETURNING *",
      [nombre, tipo, req.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCliente = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = $1 AND created_by = $2 RETURNING *",
      [req.params.id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Cliente no encontrado",
      });
    }
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const updateCliente = async (req, res, next) => {
  const { nombre, tipo } = req.body;
  try {
    const result = await pool.query(
      "UPDATE clientes SET nombre = $1, tipo = $2 WHERE id_cliente = $3 AND created_by = $4 RETURNING *",
      [nombre, tipo, req.params.id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Cliente no encontrado",
      });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
