import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

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
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://rocuantazucarfront.up.railway.app",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

// API Routes
if (taskRoutes) app.use("/api", taskRoutes);
if (authRoutes) app.use("/api", authRoutes);
if (movimientosRoutes) app.use("/api", movimientosRoutes);
if (clientesRoutes) app.use("/api", clientesRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RocuantAzucar API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      movimientos: '/api/movimientos',
      clientes: '/api/clientes'
    }
  });
});

// Error handler
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