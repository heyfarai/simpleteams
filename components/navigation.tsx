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
  // Disable register button when on register page
  const isRegisterPage =
    pathname === "/register" || pathname?.startsWith("/register/");

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
            {isRegisterPage ? (
              <span className="w-full sm:w-auto whitespace-nowrap py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm rounded-full border border-transparent bg-gray-400 font-bold text-white opacity-50">
                Register
              </span>
            ) : (
              <Link
                href="/register"
                className="uppercase tracking-wide w-full sm:w-auto whitespace-nowrap py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm rounded-full border border-transparent bg-gray-800 font-bold text-white hover:bg-gray-900 focus:outline-none focus:bg-primary/80 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
              >
                Register
              </Link>
            )}
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
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:block md:order-2 md:col-start-2 md:col-end-3">
              <div className="flex flex-row items-center justify-center gap-x-5 gap-y-2 py-0 ps-7 lg:ps-0 lg:whitespace-nowrap">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-1 border-b-3 tracking-wide font-bold ${
                      pathname === item.href
                        ? "border-primary text-primary"
                        : "border-transparent text-foreground hover:text-gray-800"
                    } focus:outline-none dark:border-neutral-200 dark:text-neutral-200 dark:hover:text-neutral-200`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div
              className={`md:hidden fixed inset-0 z-[60] transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Backdrop with blur */}
              <div
                className={`absolute inset-0 bg-primary/100 backdrop-blur-md transition-all duration-500 ease-out ${
                  isOpen ? "scale-100" : "scale-110"
                }`}
              />

              {/* Navigation Content */}
              <div className="relative flex flex-col h-full">
                {/* Header with close button */}
                <div className="flex items-center justify-end p-8">
                  <button
                    type="button"
                    className="flex justify-center items-center w-9 h-9 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 flex flex-col justify-center px-8">
                  <nav className="space-y-8">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block text-3xl font-bold text-white hover:text-white/80 transition-all duration-300 ease-out transform ${
                          isOpen
                            ? "translate-x-0 opacity-100"
                            : "translate-x-8 opacity-0"
                        }`}
                        style={{
                          transitionDelay: isOpen
                            ? `${(index + 1) * 150}ms`
                            : "0ms",
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Register Button */}
                <div className="p-8">
                  {isRegisterPage ? (
                    <span
                      className={`block w-full text-center py-4 px-6 text-lg font-bold bg-white/50 text-primary/60 rounded-full transition-all duration-300 ease-out transform ${
                        isOpen
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                      style={{
                        transitionDelay: isOpen
                          ? `${(navItems.length + 1) * 150}ms`
                          : "0ms",
                      }}
                    >
                      Register Now
                    </span>
                  ) : (
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-center py-4 px-6 text-lg font-bold bg-white text-primary rounded-full hover:bg-white/90 transition-all duration-300 ease-out transform ${
                        isOpen
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                      style={{
                        transitionDelay: isOpen
                          ? `${(navItems.length + 1) * 150}ms`
                          : "0ms",
                      }}
                    >
                      Register Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
