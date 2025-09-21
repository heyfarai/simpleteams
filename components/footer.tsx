import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto bg-black w-full dark:bg-neutral-950">
      <div className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="col-span-full lg:col-span-1">
            <Link
              href="/"
              className="flex-none text-xl font-semibold text-white focus:outline-none focus:opacity-80"
              aria-label="NCHH"
            >
              <Image
                src="/nchh-logo.webp"
                alt="National Capital Hoops Circuit Logo"
                width={56}
                height={56}
                className="w-14 h-14"
              />
            </Link>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-gray-100">League</h4>
            <div className="mt-3 grid space-y-3">
              <p>
                <Link
                  href="/games"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  Schedule
                </Link>
              </p>
              <p>
                <Link
                  href="/teams"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  Teams
                </Link>
              </p>
              <p>
                <Link
                  href="/players"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  Players
                </Link>
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-gray-100">Info</h4>
            <div className="mt-3 grid space-y-3">
              <p>
                <Link
                  href="/register"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  href="/about"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  About
                </Link>
              </p>
              <p>
                <a
                  href="https://www.instagram.com/nchoopscircuit/"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  aria-label="Instagram"
                >
                  IG: @nchoopscircuit
                </a>
              </p>
              <p className="hidden">
                <a
                  href="#"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  aria-label="Facebook"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                  Facebook
                </a>
              </p>
              <p className="hidden">
                <a
                  href="#"
                  className="inline-flex gap-x-2 text-gray-100 hover:text-gray-200 focus:outline-none focus:text-gray-200 dark:text-neutral-100 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  aria-label="Facebook"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                  Facebook
                </a>
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="font-semibold text-gray-100">Stay up to date</h4>
            <form>
              <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 bg-white rounded-lg p-2 dark:bg-neutral-900">
                <div className="w-full">
                  <label
                    htmlFor="newsletter-email"
                    className="sr-only"
                  >
                    Subscribe
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    name="newsletter-email"
                    className="py-2.5 sm:py-3 px-4 block w-full border-transparent rounded-lg sm:text-sm focus:border-0 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-transparent dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto whitespace-nowrap p-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-white hover:bg-primary/80 focus:outline-none focus:bg-primary/80 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-100">
                Get updates on games, registration, and league news.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="text-sm text-gray-100 dark:text-neutral-100">
              © 2025 National Capital Hoops Circuit.
            </p>
          </div>

          {/* Social Brands */}
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="text-sm text-gray-100 dark:text-neutral-100">
              Designed and Built in 🇨🇦 by{" "}
              <Link
                href="https://simplehoops.app"
                target="_blank"
              >
                SimpleHoops
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
