import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide nav links and register button during checkout
  const isCheckoutPage = pathname?.includes("/checkout");

  const navItems = [
    { href: "/games", label: "Schedule" },
    { href: "/teams", label: "Teams" },
    // { href: "/players", label: "Players" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-40 w-full py-7">
      <nav className="absolute rounded-full top-0 p-4 md:relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-[1fr_auto_1fr] basis-full items-center px-8 lg:px-8 md:mx-auto bg-background z-50  ">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex-none text-xl inline-block font-semibold focus:outline-none focus:opacity-80 "
            aria-label="NCHH"
          >
            <Image
              src="/nchh-logo.webp"
              alt="National Capital Hoops Circuit Logo"
              width={32}
              height={32}
              className="w-14 h-14 md:w-16 md:h-16 "
            />
          </Link>
          <div className="ms-1 sm:ms-2"></div>
        </div>

        {!isCheckoutPage && (
          <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 md:order-3">
            <Link
              href="/register"
              className="w-full sm:w-auto whitespace-nowrap py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm  rounded-full border border-transparent bg-gray-800 font-bold text-white hover:bg-gray-900 focus:outline-none focus:bg-primary/80 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
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
        )}

        {!isCheckoutPage && (
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } md:block overflow-hidden transition-all duration-300 basis-full md:basis-auto grow md:grow-0 md:w-auto md:order-2 md:col-start-2 md:col-end-3`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-3 mt-3 md:mt-0 py-2 md:py-0 md:ps-7 lg:ps-0 lg:whitespace-nowrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-0.5 md:py-3 px-4 md:px-1 border-s-2 tracking-wide md:border-s-0 md:border-b-2 font-bold ${
                    pathname === item.href
                      ? "border-primary  text-primary"
                      : "border-transparent text-foreground hover:text-gray-800"
                  } focus:outline-none dark:border-neutral-200 dark:text-neutral-200 dark:hover:text-neutral-200`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
