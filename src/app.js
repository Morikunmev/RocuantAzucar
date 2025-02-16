import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import taskRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import { ORIGIN } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://zooming-wholeness-production.up.railway.app",
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

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Manejar todas las demás rutas para React Router
app.get("/*", (req, res) => {
  const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
  console.log("Trying to serve:", indexPath); // Para debugging
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error("index.html not found at:", indexPath);
    res.status(404).send("File not found");
  }
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
