import { Button, Card, Input } from "../components/ui";
import { useForm } from "react-hook-form";
function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  {
    /* {
    onChange
    name
    value
  } */
  }
  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });
  console.log(errors);
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        <h3 className="text-2xl font-bold text-yellow-600">Register</h3>
        <form onSubmit={onSubmit}>
          <Input
            placeholder="Enter your fullname"
            {...register("name", {
              required: true,
            })}
          />
          {errors.name && <p className="text-red-600">Fullname is required</p>}
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
            })}
          />
          {errors.email && <p className="text-red-600">Email is required</p>}
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: true,
            })}
          />
          {errors.password && (
            <p className="text-red-600">Password is required</p>
          )}
          <Button>Register</Button>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
