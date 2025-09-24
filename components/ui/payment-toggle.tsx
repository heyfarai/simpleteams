"use client";

import { cn } from "@/lib/utils";

interface PaymentToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  leftLabel: string;
  rightLabel: string;
  badgeText?: string;
  className?: string;
}

export function PaymentToggle({
  checked,
  onChange,
  disabled = false,
  leftLabel,
  rightLabel,
  badgeText,
  className
}: PaymentToggleProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={cn("flex justify-center items-center gap-x-3", className)}>
      <label
        htmlFor="payment-toggle"
        className={cn(
          "text-sm transition-colors cursor-pointer",
          !checked ? "text-gray-900" : "text-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {leftLabel}
      </label>

      <label
        htmlFor="payment-toggle"
        className="relative inline-block w-11 h-6 cursor-pointer"
      >
        <input
          type="checkbox"
          id="payment-toggle"
          className="peer sr-only"
          checked={checked}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <span className={cn(
          "absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out",
          "peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500",
          "peer-disabled:opacity-50 peer-disabled:pointer-events-none"
        )}></span>
        <span className={cn(
          "absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs",
          "transition-transform duration-200 ease-in-out peer-checked:translate-x-full",
          "dark:bg-neutral-400 dark:peer-checked:bg-white"
        )}></span>
      </label>

      <label
        htmlFor="payment-toggle"
        className={cn(
          "relative text-sm transition-colors cursor-pointer",
          checked ? "text-gray-900" : "text-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {rightLabel}
        {badgeText && checked && (
          <span className="absolute -top-10 start-auto -end-28">
            <span className="flex items-center">
              <svg
                className="w-14 h-8 -me-6"
                width="45"
                height="25"
                viewBox="0 0 45 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                  fill="currentColor"
                  className="fill-gray-300 dark:fill-neutral-700"
                />
              </svg>
              <span className="mt-3 inline-block whitespace-nowrap text-[11px] leading-5 font-semibold uppercase bg-blue-600 text-white rounded-full py-1 px-2.5">
                {badgeText}
              </span>
            </span>
          </span>
        )}
      </label>
    </div>
  );
}