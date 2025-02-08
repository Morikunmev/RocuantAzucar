import React, { useEffect } from "react";
import { Card, Input, Textarea, Label, Button } from "../components/ui";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const { createTask, updateTask, loadTask, errors: tasksErrors } = useTasks();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    let task;
    if (!params.id) {
      task = await createTask(data);
    } else {
      task = await updateTask(params.id, data);
    }

    if (task) {
      navigate("/tasks");
    }
  });
  useEffect(() => {
    if (params.id) {
      loadTask(params.id).then((task) => {
        setValue("title", task.title);
        setValue("description", task.description);
      });
    }
  }, []);
  return (
    <div className="flex h-[80vh] justify-center items-center">
      <Card className="bg-amber-400/80 p-8 shadow-amber-500/50 w-[400px]">
        {tasksErrors.map((error, i) => (
          <p className="text-red-500" key={i}>
            {error}
          </p>
        ))}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {params.id ? "Edit task" : "Create task"}
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label
              htmlFor="title"
              className="text-gray-900 block mb-2 font-semibold"
            >
              Título
            </Label>
            <Input
              type="text"
              placeholder="Title"
              autoFocus
              className="w-full px-4 py-2 rounded-lg bg-amber-100/50 border-2 border-amber-500/30 focus:border-amber-600 focus:outline-none"
              {...register("title", {
                required: true,
              })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">
                El título es requerido
              </span>
            )}
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-gray-900 block mb-2 font-semibold"
            >
              Descripción
            </Label>
            <Textarea
              placeholder="Descripcion"
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-amber-100/50 border-2 border-amber-500/30 focus:border-amber-600 focus:outline-none resize-none"
              {...register("description")}
            />
          </div>

          <Button className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors mt-4">
            {params.id ? "Edit task" : "Create task"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default TaskFormPage;
