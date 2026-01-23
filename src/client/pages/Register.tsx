import { Link } from "react-router-dom";
import menuImage from "../assets/images/menu.png";
import { useForm } from "react-hook-form";
import { RegisterInput } from "../../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas/auth";
import { useRegisterMutation } from "../api/queries/auth";

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

  const {
    mutate: registerUser,
    isPending,
    error: mutationError,
  } = useRegisterMutation();

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <section className="flex flex-col space-y-10 items-center justify-center bg-amber-100 h-[100vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-20 flex flex-col p-4 pt-20 text-black rounded-md w-full max-w-sm"
      >
        <div className="flex justify-center">
          <img src={menuImage} alt="Logo" className="h-[6rem] w-[15rem]" />
        </div>

        <label className="mt-5 text-black font-semibold">Username</label>
        <input
          {...register("userName")}
          type="text"
          placeholder="PokerPro123"
          className={`px-2 py-3 bg-transparent border rounded-md shadow-sm focus:outline-none ${
            errors.userName ? "border-red-500" : "border-amber-900"
          }`}
        />
        {errors.userName && (
          <span className="text-red-500 text-xs mt-1">
            {errors.userName.message}
          </span>
        )}

        <label className="mt-5 text-black font-semibold">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="poker@example.com"
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
          placeholder="••••••••"
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
          {isPending ? "CREATING ACCOUNT..." : "REGISTER"}
        </button>

        <Link
          to="/"
          className="mt-5 text-center text-gray-500 hover:text-amber-900 transition-colors"
        >
          Already have an account?
        </Link>
      </form>

      {mutationError && (
        <p className="text-red-500 font-bold p-2 bg-red-50 rounded border border-red-200">
          {mutationError.message || "Registration failed. Try again."}
        </p>
      )}
    </section>
  );
};

export default Register;
