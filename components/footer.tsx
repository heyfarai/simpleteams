import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto bg-primary w-full dark:bg-neutral-950">
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
          <div>
            <a
              href="#"
              className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-none focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
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
            </a>
            <a
              href="#"
              className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-none focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Twitter"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
            </a>
            <a
              href="#"
              className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-none focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Instagram"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
