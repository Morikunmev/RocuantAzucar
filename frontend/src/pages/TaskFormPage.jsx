import React from "react";
import { Card, Input, Textarea, Label, Button } from "../components/ui";
import { useForm } from "react-hook-form";
import { createTaskRequest } from "../api/tasks.api";
import { useNavigate } from "react-router-dom";

function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (data) => {
    const res = await createTaskRequest(data);
    navigate("/tasks");
  });
  return (
    <div className="flex h-[80vh] justify-center items-center">
      <Card>
        <h2 className="text-3xl font-bold my-4">Create Task</h2>
        <form onSubmit={onSubmit}>
          <Label htmlFor="title">Título</Label>
          <Input
            type="text"
            name=""
            id=""
            placeholder="Title"
            autoFocus
            {...register("title", {
              required: true,
            })}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">El título es requerido</span>
          )}
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            name=""
            id=""
            placeholder="Descripcion"
            rows={3}
            {...register("description")}
          ></Textarea>
          <Button>Create</Button>
        </form>
      </Card>
    </div>
  );
}

export default TaskFormPage;
