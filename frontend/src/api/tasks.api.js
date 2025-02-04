import axios from "./axios";
export const createTaskRequest = (task) => axios.post("/tasks", task);
