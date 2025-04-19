import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] border-b border-neutral-300 py-2 px-4 sm:px-8 items-center justify-between bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Gifting Arena Logo"
            width={36}
            height={36}
            priority
          />
          <span className="text-xl sm:text-2xl font-bold text-gray-800">Gifting Arena AI</span>
        </Link>
      </div>
    </div>
  );
};
