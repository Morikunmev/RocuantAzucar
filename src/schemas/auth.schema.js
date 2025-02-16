import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El email debe ser un texto",
    })
    .email({ message: "El email debe ser un email valido" }),
  password: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El password debe ser un texto",
    })
    .min(6,{
        message:"La contraseña debe tener al menos 6 caracteres"
    })
    .max(255,{
        message:"la contraseña debe tener como maximo 255 caracteres"
    }),
});