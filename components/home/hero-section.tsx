"use client";

import Image from "next/image";
import { NextSessionCard } from "./next-session-card";

export function HeroSection() {
  return (
    <section className="relative max-h-[80vh] min-h-[600px] w-full overflow-hidden flex bg-contain bg-center bg-no-repeat bg-opacity-50 ">
      {/* Overlay for better content readability */}
      <div className="absolute inset-0 "></div>

      <div className="relative flex-1 lg:w-2/3 p-0 z-10">
        {/* Hero Content */}
        <div className="">
          <div className="contentContainer mx-auto ">
            <Image
              src="/img/hero-season-2.png"
              alt="Basketball Court"
              fill
              className="object-contain p-8 mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
