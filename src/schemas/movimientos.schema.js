import { z } from "zod";
import { pool } from "../db.js";

// Primero definimos el schema base
const movimientoSchema = z.object({
  fecha: z
    .string({
      required_error: "La fecha es requerida",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

  numero_factura: z
    .string({
      required_error: "El número de factura es requerido",
    })
    .min(1, "El número de factura no puede estar vacío"),

  id_cliente: z.number({
    required_error: "El id del cliente es requerido",
    invalid_type_error: "El id del cliente debe ser un número",
  }),

  tipo_movimiento: z
    .string({
      required_error: "El tipo de movimiento es requerido",
    })
    .refine((val) => ["Compra", "Venta"].includes(val), {
      message: "El tipo de movimiento debe ser 'Compra' o 'Venta'",
    }),

  valor_kilo: z
    .number({
      required_error: "El valor por kilo es requerido",
      invalid_type_error: "El valor por kilo debe ser un número",
    })
    .positive("El valor por kilo debe ser mayor que 0"),

  stock_kilos: z
    .number({
      required_error: "El stock es requerido",
      invalid_type_error: "El stock debe ser un número",
    })
    .nonnegative("El stock no puede ser negativo"),

  ingreso_kilos: z
    .number()
    .nonnegative("Los kilos ingresados no pueden ser negativos")
    .nullable(),

  egreso_kilos: z
    .number()
    .nonnegative("Los kilos egresados no pueden ser negativos")
    .nullable(),

  compra_azucar: z
    .number()
    .nonnegative("El monto de compra no puede ser negativo")
    .nullable(),

  venta_azucar: z
    .number()
    .nonnegative("El monto de venta no puede ser negativo")
    .nullable(),

  utilidad_neta: z.number().nullable(),

  utilidad_total: z.number().nullable(),
});

// Schema con validaciones adicionales
const movimientoSchemaWithValidations = movimientoSchema.superRefine(
  (data, ctx) => {
    if (data.tipo_movimiento === "Compra") {
      if (!data.ingreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Los kilos ingresados son requeridos para movimientos de compra",
          path: ["ingreso_kilos"],
        });
      }
      if (data.egreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No se pueden especificar kilos egresados en una compra",
          path: ["egreso_kilos"],
        });
      }
    }

    if (data.tipo_movimiento === "Venta") {
      if (!data.egreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Los kilos egresados son requeridos para movimientos de venta",
          path: ["egreso_kilos"],
        });
      }
      if (data.ingreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No se pueden especificar kilos ingresados en una venta",
          path: ["ingreso_kilos"],
        });
      }
    }
  }
);

// Schema para crear movimientos (incluye validación de número de factura único)
export const createMovimientoSchema = movimientoSchemaWithValidations.refine(
  async (data) => {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM movimientos WHERE numero_factura = $1",
        [data.numero_factura]
      );
      return parseInt(result.rows[0].count) === 0;
    } catch (error) {
      return false;
    }
  },
  {
    message: "Este número de factura ya existe",
    path: ["numero_factura"],
  }
);

// Schema para actualizar movimientos (todas las propiedades son opcionales)
export const updateMovimientoSchema = movimientoSchema.partial();
