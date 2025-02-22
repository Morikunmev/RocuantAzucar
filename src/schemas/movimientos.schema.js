import { z } from "zod";
import { pool } from "../db.js";

// Schema base
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
    .min(1, "El número de factura no puede estar vacío")
    .nullable(), // Permitir null para ajustes

  id_cliente: z
    .number({
      invalid_type_error: "El id del cliente debe ser un número",
    })
    .nullable(), // Permitir null para ajustes

  tipo_movimiento: z
    .string({
      required_error: "El tipo de movimiento es requerido",
    })
    .refine((val) => ["Compra", "Venta", "Ajuste"].includes(val), {
      message: "El tipo de movimiento debe ser 'Compra', 'Venta' o 'Ajuste'",
    }),

  valor_kilo: z
    .number({
      invalid_type_error: "El valor por kilo debe ser un número",
    })
    .positive("El valor por kilo debe ser mayor que 0")
    .nullable(), // Permitir null para ajustes

  stock_kilos: z
    .number({
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

// Schema con validaciones específicas por tipo de movimiento
const movimientoSchemaWithValidations = movimientoSchema.superRefine(
  (data, ctx) => {
    // Validaciones para Ajuste
    if (data.tipo_movimiento === "Ajuste") {
      // Verificar que solo se incluyan los campos permitidos para ajuste
      const camposAjuste = ["fecha", "tipo_movimiento", "stock_kilos"];
      Object.keys(data).forEach((campo) => {
        if (
          !camposAjuste.includes(campo) &&
          data[campo] !== null &&
          data[campo] !== undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El campo ${campo} no debe estar presente en un ajuste`,
            path: [campo],
          });
        }
      });

      // Verificar que stock_kilos esté presente
      if (data.stock_kilos === undefined || data.stock_kilos === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El stock_kilos es requerido para ajustes",
          path: ["stock_kilos"],
        });
      }
      return; // Terminar aquí para ajustes
    }

    // Validaciones para Compra
    if (data.tipo_movimiento === "Compra") {
      // Verificar campos requeridos
      if (!data.numero_factura) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El número de factura es requerido para compras",
          path: ["numero_factura"],
        });
      }
      if (!data.ingreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Los kilos ingresados son requeridos para compras",
          path: ["ingreso_kilos"],
        });
      }
      if (!data.valor_kilo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El valor por kilo es requerido para compras",
          path: ["valor_kilo"],
        });
      }
      // Verificar campos que no deben estar presentes
      if (data.egreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No se pueden especificar kilos egresados en una compra",
          path: ["egreso_kilos"],
        });
      }
      if (data.utilidad_neta || data.utilidad_total) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No se puede especificar utilidad en una compra",
          path: ["utilidad_neta"],
        });
      }
    }

    // Validaciones para Venta
    if (data.tipo_movimiento === "Venta") {
      // Verificar campos requeridos
      if (!data.numero_factura) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El número de factura es requerido para ventas",
          path: ["numero_factura"],
        });
      }
      if (!data.egreso_kilos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Los kilos egresados son requeridos para ventas",
          path: ["egreso_kilos"],
        });
      }
      if (!data.valor_kilo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El valor por kilo es requerido para ventas",
          path: ["valor_kilo"],
        });
      }
      // Verificar campos que no deben estar presentes
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
    // Solo validar número de factura único si no es un ajuste
    if (data.tipo_movimiento !== "Ajuste" && data.numero_factura) {
      try {
        const result = await pool.query(
          "SELECT COUNT(*) FROM movimientos WHERE numero_factura = $1",
          [data.numero_factura]
        );
        return parseInt(result.rows[0].count) === 0;
      } catch (error) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Este número de factura ya existe",
    path: ["numero_factura"],
  }
);

// Schema para actualizar movimientos (todas las propiedades son opcionales)
export const updateMovimientoSchema = movimientoSchema.partial();
