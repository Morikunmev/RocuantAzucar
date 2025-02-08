import { useEffect } from "react";
import { getAllTasksRequest } from "../api/tasks.api";
import TaskCard from "../components/tasks/TaskCard";
import { useTasks } from "../context/TaskContext";

function TasksPage() {
  const { tasks, loadTasks } = useTasks();

  useEffect(() => {
    loadTasks();
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <h2 className="text-2xl font-semibold text-gray-600">
          No hay tareas todavía
        </h2>
        <p className="text-gray-500">Comienza creando una nueva tarea</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TasksPage;
