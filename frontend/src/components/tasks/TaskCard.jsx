import { Card } from "../ui";
function TaskCard({ task }) {
  return (
    <Card
      key={task.id}
      className="bg-amber-400/80 p-4 transform transition-all duration-300 animate-pulse shadow-amber-500/50 hover:scale-105 hover:bg-amber-500/90 hover:shadow-lg cursor-pointer"
    >
      <h1 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h1>
      <p className="text-gray-900">{task.description}</p>
    </Card>
  );
}
export default TaskCard;
