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
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // Otros errores
    return res.status(400).json({
      message: error.message || "Invalid request data",
    });
  }
};
