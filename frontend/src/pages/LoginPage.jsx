import { useForm } from "react-hook-form";
import { Card, Input, Button } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import imagen from "../assets/fondoazucar.jpeg";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signin, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);
    if (user) {
      navigate("/tasks");
    }
  });

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${imagen})`,
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundBlend: "overlay",
      }}
    >
      <Card className="w-96 p-8 bg-black/40 backdrop-blur-sm border border-gray-700">
        {loginErrors &&
          loginErrors.map((err) => (
            <p key={err} className="text-red-400 text-sm text-center mb-4">
              {err}
            </p>
          ))}

        <h2 className="text-3xl font-normal text-gray-200 mb-8 text-center">
          Log In
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              className="w-full h-11 bg-black/30 border-0 rounded text-gray-300 placeholder-gray-500 focus:ring-1 focus:ring-gray-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
                onChange: () => {
                  clearErrors("email");
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full h-11 bg-black/30 border-0 rounded text-gray-300 placeholder-gray-500 focus:ring-1 focus:ring-gray-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                onChange: () => {
                  clearErrors("password");
                },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 bg-black/30 border-gray-600 rounded focus:ring-0"
              />
              <label htmlFor="remember" className="ml-2">
                Remember me
              </label>
            </div>
          </div>

          <Button className="w-full h-11 bg-green-700 hover:bg-green-600 text-white font-medium rounded transition-colors">
            Log In
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
