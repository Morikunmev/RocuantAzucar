import { useForm } from "react-hook-form";
import { Card, Input, Button, Label } from "../components/ui";
import { Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/signin", data, {
        withCredentials: true,
      });
      console.log(res);
    } catch (error) { 
      console.log(error);
    }
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-amber-800 to-amber-600 bg-cover bg-center">
      <Card>
        <h1 className="text-3xl font-bold mb-8 text-center text-amber-800">
          Iniciar sesión
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Label htmlFor="email" className="text-amber-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            className="h-12 px-4 rounded-lg border border-amber-200 focus:border-amber-500 transition-colors bg-amber-50 text-gray-800 placeholder:text-amber-300"
            {...register("email", {
              required: true,
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">El email es requerido</p>
          )}

          <Label htmlFor="password" className="text-amber-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            className="h-12 px-4 rounded-lg border border-amber-200 focus:border-amber-500 transition-colors bg-amber-50 text-gray-800 placeholder:text-amber-300"
            {...register("password", {
              required: true,
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">La contraseña es requerida</p>
          )}

          <Button className="bg-gray-900 hover:bg-gray-800 text-white h-12 mt-4 rounded-lg transition-colors w-full font-medium">
            Iniciar sesión
          </Button>
          <div className="flex justify-center gap-2 mt-4 text-sm">
            <p className="text-amber-700">¿No tienes una cuenta?</p>
            <Link
              to="/register"
              className="font-semibold text-amber-600 hover:text-amber-800"
            >
              Regístrate
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;