import { Link } from "react-router-dom";
import menuImage from "../assets/images/menu.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput } from "../../types/auth";
import { LoginSchema } from "../schemas/auth";
import { useLoginMutation } from "../api/queries/auth";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-8">
          {/* Header / Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={menuImage}
              alt="Chess Online"
              className="h-24 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300 invert"
            />
            <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="your@email.com"
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
                {mutationError.message ||
                  "Invalid credentials. Please try again."}
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
                  <span>Checking mate...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
              >
                Create one now
              </Link>
            </div>

            {/* Test Accounts Widget */}
            <div className="pt-6 border-t border-gray-700">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
                  <FaUserCircle className="text-lg" />
                  <span>Demo Accounts</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600 shadow-sm">
                    <span className="font-mono text-gray-300">
                      guest@gmail.com
                    </span>
                    <span className="text-gray-500 border-l pl-2 border-gray-600">
                      guest123
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600 shadow-sm">
                    <span className="font-mono text-gray-300">
                      test@gmail.com
                    </span>
                    <span className="text-gray-500 border-l pl-2 border-gray-600">
                      guest123
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
