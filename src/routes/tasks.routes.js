import { Router } from "express";
const router = Router();
router.get("/tasks", (req, res) => {
  res.send("Obteniendo tareas");
});
router.get("/tasks/:id", (req, res) => {
  res.send("Obteniendo tarea con id " + req.params.id);
});

router.post("/tasks", (req, res) => {
  res.send("Creando tarea");
});

router.put("/tasks/:id", (req, res) => {
  res.send("Actualizando tarea con id " + req.params.id);
});

router.delete("/tasks/:id", (req, res) => {
  res.send("Eliminando tarea con id " + req.params.id);
});
export default router;
