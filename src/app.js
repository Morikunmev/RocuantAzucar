import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import taskRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";

import { ORIGIN } from "./config.js";
const app = express();
//Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Añade todos los orígenes permitidos
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/", (req, res) => res.json({ message: "Welcome to my Api" }));
app.use("/api", taskRoutes);
app.use("/api", authRoutes);
app.use("/api", movimientosRoutes);

//Error handlers
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
