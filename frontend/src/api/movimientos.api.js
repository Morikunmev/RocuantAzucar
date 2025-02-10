import client from "./axios";

// Obtener todos los movimientos
export const getAllMovimientosRequest = () => client.get("/movimientos");

// Obtener un movimiento específico
export const getMovimientoRequest = (id) => client.get(`/movimientos/${id}`);

// Crear un nuevo movimiento
export const createMovimientoRequest = (movimiento) => {
  console.log("Sending request with data:", movimiento); // Debug log
  return client.post("/movimientos", movimiento);
};

// Actualizar un movimiento
export const updateMovimientoRequest = (id, movimiento) =>
  client.put(`/movimientos/${id}`, movimiento);

// Eliminar un movimiento
export const deleteMovimientoRequest = (id) =>
  client.delete(`/movimientos/${id}`);
