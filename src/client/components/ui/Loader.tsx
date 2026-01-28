import React from "react";
import { cn } from "../../lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loader: React.FC<LoaderProps> = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-emerald-500 border-r-emerald-500/30 border-b-emerald-500/30 border-l-emerald-500/30",
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Loader;
