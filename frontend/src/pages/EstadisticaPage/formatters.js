// Modifica formatters.js para incluir una verificación de soporte
export const formatCLP = (value) => {
  if (typeof value !== "number") return "$ 0";

  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    // Fallback simple si Intl no está soportado
    return "$ " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

export const formatNumber = (value) => {
  if (typeof value !== "number") return "0";

  try {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback simple si Intl no está soportado
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};
