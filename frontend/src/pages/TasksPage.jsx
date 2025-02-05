import { useEffect, useState } from "react";
import { getAllTasksRequest } from "../api/tasks.api";
import TaskCard from "../components/tasks/TaskCard";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getAllTasksRequest().then((response) => {
      setTasks(response.data);
      console.log(response.data);
    });
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TasksPage;
