import { z } from "zod";

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

  tipo_movimiento: z.enum(["Compra", "Venta"], {
    required_error: "El tipo de movimiento es requerido",
    invalid_type_error: "El tipo de movimiento debe ser 'Compra' o 'Venta'",
  }),

  valor_kilo: z
    .number({
      required_error: "El valor por kilo es requerido",
      invalid_type_error: "El valor por kilo debe ser un número",
    })
    .positive("El valor por kilo debe ser mayor que 0"),

  ingreso_kilos: z
    .number({
      invalid_type_error: "Los kilos ingresados deben ser un número",
    })
    .nonnegative("Los kilos ingresados no pueden ser negativos")
    .nullish()
    .superRefine((val, ctx) => {
      if (ctx.parent.tipo_movimiento === "Compra" && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Los kilos ingresados son requeridos para movimientos de compra",
        });
      }
    }),

  egreso_kilos: z
    .number({
      invalid_type_error: "Los kilos egresados deben ser un número",
    })
    .nonnegative("Los kilos egresados no pueden ser negativos")
    .nullish()
    .superRefine((val, ctx) => {
      if (ctx.parent.tipo_movimiento === "Venta" && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Los kilos egresados son requeridos para movimientos de venta",
        });
      }
    }),

  stock_kilos: z
    .number({
      required_error: "El stock es requerido",
      invalid_type_error: "El stock debe ser un número",
    })
    .nonnegative("El stock no puede ser negativo"),

  compra_azucar: z
    .number({
      invalid_type_error: "El monto de compra debe ser un número",
    })
    .nonnegative("El monto de compra no puede ser negativo")
    .nullish(),

  venta_azucar: z
    .number({
      invalid_type_error: "El monto de venta debe ser un número",
    })
    .nonnegative("El monto de venta no puede ser negativo")
    .nullish(),

  utilidad_neta: z
    .number({
      invalid_type_error: "La utilidad neta debe ser un número",
    })
    .nullish(),

  utilidad_total: z
    .number({
      invalid_type_error: "La utilidad total debe ser un número",
    })
    .nullish(),
});

export const createMovimientoSchema = movimientoSchema;

export const updateMovimientoSchema = movimientoSchema.partial();
