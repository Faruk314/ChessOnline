import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput } from "../../types/auth";
import { LoginSchema } from "../schemas/auth";
import { useLoginMutation } from "../api/queries/auth";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AuthLayout } from "../components/layouts/AuthLayout";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginUser, isPending } = useLoginMutation();

  const onSubmit = (data: LoginInput) => {
    loginUser(data);
  };

  const footer = (
    <>
      <div className="text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
        >
          Create one now
        </Link>
      </div>

      <div className="pt-6 border-t border-gray-700">
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
            <FaUserCircle className="text-lg" />
            <span>Demo Accounts</span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600 shadow-sm">
              <span className="font-mono text-gray-300">guest@gmail.com</span>
              <span className="text-gray-500 border-l pl-2 border-gray-600">
                guest123
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600 shadow-sm">
              <span className="font-mono text-gray-300">test@gmail.com</span>
              <span className="text-gray-500 border-l pl-2 border-gray-600">
                guest123
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to continue"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
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

        <Button isLoading={isPending} loadingText="Checking mate...">
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
