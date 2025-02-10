import { z } from "zod";

export const createClienteSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(1, "El nombre no puede estar vacío"),
  tipo: z
    .string({
      required_error: "El tipo es requerido",
    })
    .min(1, "El tipo no puede estar vacío"),
});

export const updateClienteSchema = createClienteSchema.partial();