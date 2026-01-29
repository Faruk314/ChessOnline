import React, { ReactNode } from "react";
import menuImage from "../../assets/images/menu.png";

interface MenuLayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
  topRightContent?: ReactNode;
  footerContent?: ReactNode;
}

export const MenuLayout: React.FC<MenuLayoutProps> = ({
  children,
  headerContent,
  topRightContent,
  footerContent,
}) => {
  return (
    <section className="min-h-screen bg-gray-900 text-white font-bold flex flex-col justify-center items-center overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        ></div>
      </div>

      <div className="fixed top-0 left-0 w-full p-4 md:p-6 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex items-center space-x-2 md:space-x-4 pointer-events-auto">
          {headerContent}
        </div>

        {topRightContent && (
          <div className="pointer-events-auto">{topRightContent}</div>
        )}
      </div>

      <div className="z-20 w-full max-w-sm md:max-w-md px-4 flex flex-col gap-4 md:gap-6 mt-20 md:mt-0">
        <div className="mb-8 flex justify-center">
          <img
            src={menuImage}
            className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl invert transition-transform hover:scale-105 duration-500"
            alt="Game Logo"
          />
        </div>

        {children}

        {footerContent}
      </div>
    </section>
  );
};
