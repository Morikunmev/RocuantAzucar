import axios from "./axios";

/**
 * Obtiene estadísticas de ventas por período
 * @param {string} periodo - Período a consultar (mensual, trimestral, anual)
 */
export const getVentasEstadisticas = (periodo = "anual") =>
  axios.get(`/estadisticas/ventas?periodo=${periodo}`);

/**
 * Obtiene estadísticas de compras por período
 * @param {string} periodo - Período a consultar (mensual, trimestral, anual)
 */
export const getComprasEstadisticas = (periodo = "anual") =>
  axios.get(`/estadisticas/compras?periodo=${periodo}`);

/**
 * Obtiene comparativa de compras vs ventas (por mes y totales)
 * @param {string} periodo - Período a consultar (mensual, trimestral, anual)
 */
export const getComprasVsVentas = (periodo = "anual") =>
  axios.get(`/estadisticas/compras-vs-ventas?periodo=${periodo}`);

/**
 * Obtiene la distribución de clientes por tipo
 */
export const getDistribucionClientes = () =>
  axios.get("/estadisticas/clientes");

/**
 * Obtiene los clientes que más compran (TOP)
 * @param {number} limite - Cantidad máxima de clientes a retornar
 * @param {string} periodo - Período a consultar (mensual, trimestral, anual)
 */
export const getClientesTop = (limite = 5, periodo = "anual") =>
  axios.get(`/estadisticas/clientes-top?limite=${limite}&periodo=${periodo}`);

/**
 * Obtiene las transacciones (compras y ventas) por cliente
 * @param {string} periodo - Período a consultar (mensual, trimestral, anual)
 */
export const getClientesTransacciones = (periodo = "anual") =>
  axios.get(`/estadisticas/clientes-transacciones?periodo=${periodo}`);

/**
 * Obtiene el balance de inventario (total, entradas y salidas)
 */
export const getBalanceInventario = () => axios.get("/estadisticas/balance");

/**
 * Obtiene resumen general de estadísticas
 */
export const getResumenEstadisticas = () => axios.get("/estadisticas/resumen");

export default {
  getVentasEstadisticas,
  getComprasEstadisticas,
  getComprasVsVentas,
  getDistribucionClientes,
  getClientesTop,
  getClientesTransacciones,
  getBalanceInventario,
  getResumenEstadisticas,
};