import { useForm } from "react-hook-form";
import { Card, Input, Button, Label } from "../components/ui";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { signin, errors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);
    if (user) {
      navigate("/profile");
    }
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-amber-700 to-amber-600">
      <Card className="bg-amber-500 p-8 rounded-xl w-96">
        {errors &&
          errors.map((err) => (
            <p
              key={err}
              className="bg-red-500 text-white p-2 text-center mb-4 rounded"
            >
              {err}
            </p>
          ))}
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Iniciar sesión
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="email" className="text-gray-900 text-lg">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="h-12 w-full bg-amber-300/50 rounded-lg text-gray-900 placeholder-amber-600/50"
              {...register("email", { required: true })}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-900 text-lg">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="h-12 w-full bg-amber-300/50 rounded-lg text-gray-900 placeholder-amber-600/50"
              {...register("password", { required: true })}
            />
          </div>

          <Button className="bg-amber-600 hover:bg-amber-700 text-white h-12 rounded-lg w-full text-lg font-medium mt-4">
            Iniciar sesión
          </Button>

          <div className="flex justify-center gap-2 text-gray-900">
            <span>¿No tienes una cuenta?</span>
            <Link to="/register" className="font-medium hover:text-amber-800">
              Crear cuenta
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
export default LoginPage;
