/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import Link from "next/link";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] border-b border-neutral-300 py-2 px-4 sm:px-8 items-center justify-between bg-white shadow-sm">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Gifting Arena Logo" className="h-10 w-auto sm:h-12" />
        <span className="text-xl sm:text-2xl font-bold text-gray-800">Gifting Arena AI</span>
      </Link>
    </div>
  );
};
