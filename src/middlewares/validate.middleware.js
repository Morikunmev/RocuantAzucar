export const validateSchema = (schema) => async (req, res, next) => {
  try {
    // Debug logs
    console.log("Request headers:", req.headers);
    console.log("Raw request body:", req.body);

    // Verificar si hay body
    if (!req.body) {
      throw new Error("Request body is missing");
    }

    // Validar con Zod
    const validData = await schema.parseAsync(req.body);
    console.log("Validated data:", validData);

    // Asignar datos validados
    req.body = validData;

    next();
  } catch (error) {
    console.error("Validation error:", error);

    // Si es un error de Zod
    if (error.errors) {
      // Formatear el error de una manera más limpia
      const errorMessage = error.errors.find(
        (e) => e.message === "Este número de factura ya existe"
      )
        ? "Este número de factura ya existe"
        : error.errors[0].message;

      return res.status(400).json({
        status: "error",
        message: errorMessage,
      });
    }

    // Otros errores
    return res.status(400).json({
      status: "error",
      message: error.message || "Invalid request data",
    });
  }
};
