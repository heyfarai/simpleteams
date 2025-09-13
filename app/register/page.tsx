"use client";

import { TeamRegistrationForm } from "@/components/team-registration-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen  py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="font-black lg:text-8xl md:text-6xl text-5xl tracking-tight  text-gray-900 mb-2">
            Team Registration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Registration open for the 2025-26 season.
          </p>
        </div>

        <TeamRegistrationForm />
      </div>
    </div>
  );
}
