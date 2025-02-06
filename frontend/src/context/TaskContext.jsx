import { useContext, createContext, useState } from "react";
import {
  getAllTasksRequest,
  deleteTaskRequest,
  createTaskRequest,
} from "../api/tasks.api";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadTasks = async () => {
    const res = await getAllTasksRequest();
    setTasks(res.data);
  };
  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      setTasks([...tasks, res.data]);
      return res.data;
    } catch (error) {
      if (error.response) {
        setErrors([error.response.data.message]);
      }
    }
  };
  const deleteTask = async (id) => {
    const res = await deleteTaskRequest(id);
    if (res.status === 204) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    // Este return estaba fuera de la función TaskProvider
    <TaskContext.Provider value={{ tasks, loadTasks, deleteTask, createTask }}>
      {children}
    </TaskContext.Provider>
  );
}; // Faltaba el punto y coma aquí
