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
          <div className="heading-highlight-container">
            <h1 className="display-heading heading-highlight">Register</h1>
          </div>
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
