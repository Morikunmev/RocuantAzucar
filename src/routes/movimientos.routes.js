import Router from "express-promise-router";
import {
  createMovimiento,
  deleteMovimiento,
  getAllMovimientos,
  getMovimiento,
  updateMovimiento,
} from "../controllers/movimientos.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  createMovimientoSchema,
  updateMovimientoSchema,
} from "../schemas/movimientos.schema.js";

const router = Router();

router.get("/movimientos", isAuth, getAllMovimientos);
router.get("/movimientos/:id", isAuth, getMovimiento);
router.post(
  "/movimientos",
  isAuth,
  validateSchema(createMovimientoSchema),
  createMovimiento
);
router.put(
  "/movimientos/:id",
  isAuth,
  validateSchema(updateMovimientoSchema),
  updateMovimiento
);
router.delete("/movimientos/:id", isAuth, deleteMovimiento);

export default router;
