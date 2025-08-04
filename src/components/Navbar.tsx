"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import ToggleTheme from "./ToggleTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavMenu from "./NavMenu";
import { useState } from "react";
import { navIcons } from "@/constant/data";

const Navbar = () => {
  const pathname = usePathname();
  const [showIcons, setShowIcons] = useState(true);
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 ">
      <div>
        <Image
          src="/images/logo.png"
          alt="Fluently Logo"
          width={120}
          height={120}
        />
      </div>
      {pathname !== "/" && pathname !== "/sign-in" && (
        <ul className="hidden sm:flex gap-8 text-gray-700 dark:text-gray-200">
          {navIcons.map((nav) => (
            <Link
              href={nav.href}
              key={nav.id}
              className="hover:text-cyan-600 dark:hover:text-gray-400"
            >
              {nav.text}
            </Link>
          ))}
        </ul>
      )}
      {pathname !== "/" && pathname !== "/sign-in" && showIcons && (
        <div className="sm:hidden">
          <NavMenu setShowIcons={setShowIcons} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Image
          src="/images/navmenu.png"
          alt="menu"
          width={24}
          height={24}
          className="cursor-pointer rounded-2xl sm:hidden"
          onClick={() => setShowIcons(!showIcons)}
        />
        <ToggleTheme />
        <SignedOut>
          <SignInButton>
            <button className="bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full font-medium text-sm sm:text-base h-8 sm:h-10 px-2 sm:px-3 cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full font-medium text-sm sm:text-base h-8 sm:h-10 px-2 sm:px-3 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
