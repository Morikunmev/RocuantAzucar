import { pool } from "../db.js";

export const getAllTasks = (req, res) => res.send("Obteniendo tareas");
export const getTask = (req, res) => res.send("Obteniendo tarea unica");

export const createTask = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).send("Ya existe una tarea con ese titulo");
    }
    next(error);
  }
};

export const updateTask = (req, res) => res.send("Actualizando tarea unica");

export const deleteTask = (req, res) => res.send("Eliminando tarea unica");
