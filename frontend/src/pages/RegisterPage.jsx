import { Button, Card, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await signup(data);
    navigate("/profile");
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-amber-800 to-amber-600 bg-cover bg-center">
      <Card>
        <h1 className="text-3xl font-bold mb-8 text-center text-amber-800">
          Registro
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Label htmlFor="name" className="text-amber-700">
            Nombre completo
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Ingresa tu nombre"
            className="h-12 px-4 rounded-lg border border-amber-200 focus:border-amber-500 transition-colors bg-amber-50 text-gray-800 placeholder:text-amber-300"
            {...register("name", {
              required: true,
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">El nombre es requerido</p>
          )}

          <Label htmlFor="email" className="text-amber-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu email"
            className="h-12 px-4 rounded-lg border border-amber-200 focus:border-amber-500 transition-colors bg-amber-50 text-gray-800 placeholder:text-amber-300"
            {...register("email", {
              required: true,
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">El email es requerido</p>
          )}

          <Label htmlFor="password" className="text-amber-700">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            className="h-12 px-4 rounded-lg border border-amber-200 focus:border-amber-500 transition-colors bg-amber-50 text-gray-800 placeholder:text-amber-300"
            {...register("password", {
              required: true,
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">La contraseña es requerida</p>
          )}

          <Button className="bg-gray-900 hover:bg-gray-800 text-white h-12 mt-4 rounded-lg transition-colors w-full font-medium">
            Registrarse
          </Button>

          <div className="flex justify-center gap-2 mt-4 text-sm">
            <p className="text-amber-700">¿Ya tienes una cuenta?</p>
            <Link
              to="/login"
              className="font-semibold text-amber-600 hover:text-amber-800"
            >
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
