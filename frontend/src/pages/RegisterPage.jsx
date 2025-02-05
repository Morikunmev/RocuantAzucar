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
  const { signup, errors: signupErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signup(data);
    if (user) {
      navigate("/profile");
    }
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-amber-700 to-amber-600">
      <Card className="bg-amber-500 p-8 rounded-xl w-96">
        {signupErrors &&
          signupErrors.map((err) => (
            <p
              key={err}
              className="bg-red-500 text-white p-2 text-center mb-4 rounded"
            >
              {err}
            </p>
          ))}
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Registro
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="name" className="text-gray-900 text-lg">
              Nombre completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ingresa tu nombre"
              className="h-12 w-full bg-amber-300/50 rounded-lg text-gray-900 placeholder-amber-600/50"
              {...register("name", {
                required: true,
              })}
            />
            {errors.name && (
              <p className="text-red-700 text-sm mt-1">
                El nombre es requerido
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-900 text-lg">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu email"
              className="h-12 w-full bg-amber-300/50 rounded-lg text-gray-900 placeholder-amber-600/50"
              {...register("email", {
                required: true,
              })}
            />
            {errors.email && (
              <p className="text-red-700 text-sm mt-1">El email es requerido</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-900 text-lg">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="h-12 w-full bg-amber-300/50 rounded-lg text-gray-900 placeholder-amber-600/50"
              {...register("password", {
                required: true,
              })}
            />
            {errors.password && (
              <p className="text-red-700 text-sm mt-1">
                La contraseña es requerida
              </p>
            )}
          </div>

          <Button className="bg-amber-600 hover:bg-amber-700 text-white h-12 rounded-lg w-full text-lg font-medium mt-4">
            Registrarse
          </Button>

          <div className="flex justify-center gap-2 text-gray-900">
            <span>¿Ya tienes una cuenta?</span>
            <Link to="/login" className="font-medium hover:text-amber-800">
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
