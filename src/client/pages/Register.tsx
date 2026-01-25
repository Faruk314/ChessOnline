import { Link } from "react-router-dom";
import menuImage from "../assets/images/menu.png";
import { useForm } from "react-hook-form";
import { RegisterInput } from "../../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas/auth";
import { useRegisterMutation } from "../api/queries/auth";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src={menuImage}
              alt="Chess Online"
              className="h-24 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300 invert"
            />
            <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Join the chess community today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-300 ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  {...register("userName")}
                  type="text"
                  placeholder="Grandmaster123"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${
                    errors.userName
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-600 focus:border-emerald-500"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder-gray-500 text-white`}
                />
              </div>
              {errors.userName && (
                <p className="text-red-400 text-xs ml-1 font-medium animate-pulse">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-300 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="poker@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${
                    errors.email
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-600 focus:border-emerald-500"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder-gray-500 text-white`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs ml-1 font-medium animate-pulse">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${
                    errors.password
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-600 focus:border-emerald-500"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder-gray-500 text-white`}
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs ml-1 font-medium animate-pulse">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {mutationError && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm font-medium text-center">
                {mutationError.message || "Registration failed. Try again."}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
