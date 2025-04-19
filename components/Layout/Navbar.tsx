import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] border-b border-neutral-300 py-2 px-4 sm:px-8 items-center justify-between bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <a href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Gifting Arena Logo" className="h-8 w-auto" />
          <span className="text-xl sm:text-2xl font-bold text-gray-800">Gifting Arena AI</span>
        </a>
      </div>
    </div>
  );
};
