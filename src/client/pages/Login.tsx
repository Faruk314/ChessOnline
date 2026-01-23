import { Link } from "react-router-dom";
import menuImage from "../assets/images/menu.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput } from "../../types/auth";
import { LoginSchema } from "../schemas/auth";
import { useLoginMutation } from "../api/queries/auth";
import { useForm } from "react-hook-form";

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

  const {
    mutate: loginUser,
    isPending,
    error: mutationError,
  } = useLoginMutation();

  const onSubmit = (data: LoginInput) => {
    loginUser(data);
  };

  return (
    <section className="flex flex-col space-y-10 items-center justify-center bg-amber-100 h-[100vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-20 flex flex-col p-4 pt-20 text-black rounded-md w-full max-w-sm"
      >
        <div className="flex justify-center">
          <img src={menuImage} alt="Menu" className="h-[6rem] w-[15rem]" />
        </div>

        <label className="mt-5 text-black font-semibold">Email</label>
        <input
          {...register("email")}
          type="email"
          className={`px-2 py-3 bg-transparent border rounded-md shadow-sm focus:outline-none ${
            errors.email ? "border-red-500" : "border-amber-900"
          }`}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </span>
        )}

        <label className="mt-5 text-black font-semibold">Password</label>
        <input
          {...register("password")}
          type="password"
          className={`px-2 py-3 bg-transparent border rounded-md shadow-sm focus:outline-none ${
            errors.password ? "border-red-500" : "border-amber-900"
          }`}
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </span>
        )}

        <button
          disabled={isPending}
          className="px-2 py-3 mt-5 text-xl font-bold text-white rounded-md bg-amber-900 hover:bg-amber-950 transition-colors disabled:opacity-50"
        >
          {isPending ? "LOGGING IN..." : "LOGIN"}
        </button>

        <div className="mt-6 p-3 bg-amber-200/50 rounded-lg text-sm italic">
          <span className="font-bold block mb-1">Test accounts:</span>
          <div className="flex justify-between">
            <span>guest@gmail.com</span>
            <span>guest123</span>
          </div>
          <div className="flex justify-between">
            <span>test@gmail.com</span>
            <span>guest123</span>
          </div>
        </div>

        <Link
          to="/register"
          className="mt-5 text-center text-gray-600 hover:underline"
        >
          Create an account
        </Link>
      </form>

      {mutationError && (
        <p className="text-red-500 font-bold bg-red-100 px-4 py-2 rounded-md">
          {mutationError.message || "Invalid credentials"}
        </p>
      )}
    </section>
  );
};

export default Login;
