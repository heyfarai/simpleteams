"use client";

import { PackageSelectionStep } from "@/components/registration/package-selection-step";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handlePackageSelect = (packageId: string) => {
    // Navigate to checkout with selected package
    router.push(`/register/checkout?package=${packageId}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="font-black lg:text-8xl md:text-6xl text-5xl tracking-tight text-gray-900 mb-2">
            Pick Your Play
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your path. Commit to greatness.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <PackageSelectionStep
            selectedPackage=""
            onPackageSelect={handlePackageSelect}
          />
        </div>
      </div>
    </div>
  );
}
