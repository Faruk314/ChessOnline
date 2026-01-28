import React from "react";
import { IconType } from "react-icons";
import { FaChessPawn } from "react-icons/fa";
import { cn } from "../../lib/utils";

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  label: string;
  variant?: "primary" | "secondary";
  onHover?: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  icon: Icon,
  label,
  variant = "secondary",
  onHover,
  className,
  ...props
}) => {
  const isPrimary = variant === "primary";

  return (
    <button
      onMouseEnter={onHover}
      className={cn(
        "group relative flex items-center justify-between px-6 py-4 md:px-8 md:py-5 text-lg md:text-xl font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 border-2",
        isPrimary
          ? "text-white bg-emerald-600 border-emerald-500 hover:bg-emerald-500 hover:border-emerald-400 hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)]"
          : "text-white bg-gray-800 border-gray-700 hover:border-emerald-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <div
          className={cn(
            "p-2 rounded-lg transition-colors",
            isPrimary
              ? "bg-emerald-700/50 text-white group-hover:bg-emerald-600"
              : "bg-gray-700 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
          )}
        >
          <Icon size={24} />
        </div>
        <span className="tracking-wide">{label}</span>
      </div>
      <div
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          !isPrimary && "text-emerald-500"
        )}
      >
        <FaChessPawn className="transform rotate-90" />
      </div>
    </button>
  );
};
