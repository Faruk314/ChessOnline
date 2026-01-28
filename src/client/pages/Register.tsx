import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterInput } from "../../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas/auth";
import { useRegisterMutation } from "../api/queries/auth";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthLayout } from "../components/layouts/AuthLayout";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const { mutate: registerUser, isPending } = useRegisterMutation();

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  const footer = (
    <div className="text-sm text-gray-500">
      Already have an account?{" "}
      <Link
        to="/"
        className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
      >
        Sign in
      </Link>
    </div>
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the chess community today"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Username"
          type="text"
          placeholder="Grandmaster123"
          icon={FaUser}
          registration={register("userName")}
          error={errors.userName}
        />

        <Input
          label="Email"
          type="email"
          placeholder="poker@example.com"
          icon={FaEnvelope}
          registration={register("email")}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={FaLock}
          registration={register("password")}
          error={errors.password}
        />

        <Button isLoading={isPending} loadingText="Creating Account...">
          Register
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
