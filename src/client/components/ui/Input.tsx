import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { IconType } from "react-icons";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: IconType;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  registration,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-emerald-600 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          {...registration}
          className={cn(
            "w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder-gray-400 text-gray-900",
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-emerald-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs ml-1 font-medium animate-pulse">
          {error.message}
        </p>
      )}
    </div>
  );
};
