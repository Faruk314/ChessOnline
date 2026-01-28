import React, { ReactNode } from "react";
import menuImage from "../../assets/images/menu.png";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
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
              {title}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {subtitle}
            </p>
          </div>

          {children}

          {footer && (
            <div className="mt-8 text-center space-y-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
