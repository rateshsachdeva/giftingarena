/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import Link from "next/link";

export const Navbar: FC = () => {
  return (
   <div className="flex h-[60px] py-2 px-4 sm:px-8 items-center justify-between bg-[#fff7ed] border-b border-orange-200 shadow-sm">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Gifting Arena Logo" className="h-10 w-auto sm:h-12" />
        <span className="text-2xl font-semibold text-[#D9480F]">Gifting Arena AI</span>
      </Link>
    </div>
  );
};
