import React from "react";
import { cn } from "../../lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  badgeCount?: number;
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  active,
  badgeCount = 0,
  children,
  className,
  ...props
}) => {
  return (
    <div className="relative group">
      <button
        className={cn(
          "p-2 md:p-3 rounded-xl transition-all duration-200 border-2",
          active
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400",
          className
        )}
        {...props}
      >
        {children}
      </button>
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg border-2 border-gray-900 animate-pulse">
          {badgeCount}
        </span>
      )}
    </div>
  );
};
