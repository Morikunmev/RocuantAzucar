import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// Importaciones con ruta completa y extensión .js
import taskRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import { ORIGIN } from "./config.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

// Route básica
app.get("/", (req, res) => res.json({ message: "Welcome to my Api" }));

// Verificar que las rutas existan antes de usarlas
if (taskRoutes) app.use("/api", taskRoutes);
if (authRoutes) app.use("/api", authRoutes);
if (movimientosRoutes) app.use("/api", movimientosRoutes);
if (clientesRoutes) app.use("/api", clientesRoutes);

// Error handler más detallado
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
    errors: err.errors || null,
  });
});

export default app;
