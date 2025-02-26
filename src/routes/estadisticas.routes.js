import { Router } from "express";
import {
  getVentasEstadisticas,
  getComprasEstadisticas,
  getComprasVsVentas,
  getDistribucionClientes,
  getClientesTop,
  getBalanceInventario,
  getResumenEstadisticas,
  getClientesTransacciones, // Importación de la nueva función
} from "../controllers/estadisticas.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(isAuth);

// Rutas de estadísticas
router.get("/estadisticas/ventas", getVentasEstadisticas);
router.get("/estadisticas/compras", getComprasEstadisticas);
router.get("/estadisticas/compras-vs-ventas", getComprasVsVentas);
router.get("/estadisticas/clientes", getDistribucionClientes);
router.get("/estadisticas/clientes-top", getClientesTop);
router.get("/estadisticas/balance", getBalanceInventario);
router.get("/estadisticas/resumen", getResumenEstadisticas);
router.get("/estadisticas/clientes-transacciones", getClientesTransacciones); // Nueva ruta

export default router;
