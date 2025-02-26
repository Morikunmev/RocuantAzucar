// src/pages/EstadisticaPage/formatters.js

/**
 * Formatea un valor numérico como moneda CLP
 * @param {number} value - Valor a formatear
 * @returns {string} - Valor formateado como moneda
 */
export const formatCLP = (value) => {
    if (typeof value !== "number") return "$ 0";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  /**
   * Formatea un valor numérico con separadores de miles
   * @param {number} value - Valor a formatear
   * @returns {string} - Valor formateado
   */
  export const formatNumber = (value) => {
    if (typeof value !== "number") return "0";
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  /**
   * Paleta de colores para gráficos
   */
  export const CHART_COLORS = {
    ventas: "#22C55E", // verde
    compras: "#EF4444", // rojo
    diferencia: "#F59E0B", // ámbar
    stock: "#3B82F6", // azul
    clientes: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"] // colores para series
  };
  
  export default {
    formatCLP,
    formatNumber,
    CHART_COLORS
  };