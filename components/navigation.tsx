import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useFavoriteTeam } from "@/hooks/use-favorite-team";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isFollowing } = useFavoriteTeam(""); // Empty string as no specific team is being followed in navigation
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/teams", label: "Teams" },
    { href: "/players", label: "Players" },
    { href: "/games", label: "Games" },
  ];

  return (
    <header className=" top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
      <nav className="relative max-w-2xl w-full bg-white  rounded-[24px] mx-2 flex flex-wrap md:flex-nowrap items-center justify-between px-1 py-4 sm:mx-auto dark:bg-neutral-900 ">
        <div className="flex items-center relative">
          <Link
            href="/"
            className="flex-none text-xl inline-block font-semibold focus:outline-none focus:opacity-80 "
            aria-label="NCHH"
          >
            <Image
              src="/nchh-logo.webp"
              alt="National Capital Hoops Circuit Logo"
              width={24}
              height={24}
              className="w-14 h-14 "
            />
          </Link>
        </div>

        <div className="flex items-center gap-1 md:order-4 md:ms-4">
          <Link
            href="/register"
            className="w-full sm:w-auto whitespace-nowrap py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
          >
            Register
          </Link>

          <div className="md:hidden">
            <button
              type="button"
              className="flex justify-center items-center w-9 h-9 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:block w-full basis-full md:w-auto`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 md:gap-3 mt-3 md:mt-0 py-2 md:py-0 md:ps-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-0.5 md:py-3 px-4 md:px-1 border-s-2 md:border-s-0 md:border-b-2 ${
                  pathname === item.href
                    ? "border-gray-800 font-medium text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                } focus:outline-none dark:border-neutral-200 dark:text-neutral-200 dark:hover:text-neutral-200`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
