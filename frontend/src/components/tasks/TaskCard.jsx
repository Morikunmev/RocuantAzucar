import { Card, Button } from "../ui";
import { useTasks } from "../../context/TaskContext";
function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  return (
    <Card
      key={task.id}
      className="bg-amber-400/80 p-4 transform transition-all duration-300 animate-pulse shadow-amber-500/50 hover:scale-105 hover:bg-amber-500/90 hover:shadow-lg cursor-pointer"
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h1>
          <p className="text-gray-900">{task.description}</p>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1 text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Editar
          </Button>
          <Button
            className="flex-1 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={async () => {
              if (window.confirm("Estas seguro de eliminar esta tarea?")) {
                deleteTask(task.id);
              }
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}
export default TaskCard;
