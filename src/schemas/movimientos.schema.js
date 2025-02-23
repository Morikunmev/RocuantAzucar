import { z } from "zod";
import { pool } from "../db.js";

// Schema base
const movimientoSchema = z.object({
  fecha: z
    .string({
      required_error: "La fecha es requerida",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

  tipo_movimiento: z
    .string({
      required_error: "El tipo de movimiento es requerido",
    })
    .refine((val) => ["Compra", "Venta", "Ajuste"].includes(val)),

  stock_kilos: z
    .number({
      invalid_type_error: "El stock debe ser un número",
    })
    .nonnegative("El stock no puede ser negativo")
    .nullable() // Permitir null para compras y ventas
    .optional(), // Hacer el campo opcional

  // Todos los demás campos opcionales para ajustes
  numero_factura: z.string().min(1).nullable().optional(),
  id_cliente: z.number().nullable().optional(),
  valor_kilo: z.number().positive().nullable().optional(),
  ingreso_kilos: z.number().nonnegative().nullable().optional(),
  egreso_kilos: z.number().nonnegative().nullable().optional(),
  compra_azucar: z.number().nonnegative().nullable().optional(),
  venta_azucar: z.number().nonnegative().nullable().optional(),
  utilidad_neta: z.number().nullable().optional(),
  utilidad_total: z.number().nullable().optional(),
});

// Schema con validaciones específicas por tipo de movimiento
const movimientoSchemaWithValidations = movimientoSchema.superRefine(
  (data, ctx) => {
    // Validaciones para Ajuste
    if (data.tipo_movimiento === "Ajuste") {
      // Solo validar fecha y stock_kilos para ajustes
      if (data.stock_kilos === undefined || data.stock_kilos === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El stock_kilos es requerido para ajustes",
          path: ["stock_kilos"],
        });
      }
    } else {
      // Para compras y ventas, stock_kilos debe ser null o no estar presente
      if (data.stock_kilos !== null && data.stock_kilos !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No se debe especificar stock_kilos en compras o ventas",
          path: ["stock_kilos"],
        });
      }
      // No validar otros campos para ajustes
      return;
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
    // Solo validar número de factura único si NO es un ajuste
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
