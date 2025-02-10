import { Router } from "express";
import {
  getAllClientes,
  createCliente,
  deleteCliente,
  updateCliente,
} from "../controllers/clientes.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  createClienteSchema,
  updateClienteSchema,
} from "../schemas/clientes.schema.js";

const router = Router();

router.get("/clientes", isAuth, getAllClientes);
router.post(
  "/clientes",
  isAuth,
  validateSchema(createClienteSchema),
  createCliente
);
router.delete("/clientes/:id", isAuth, deleteCliente);
router.put(
  "/clientes/:id",
  isAuth,
  validateSchema(updateClienteSchema),
  updateCliente
);

export default router;
