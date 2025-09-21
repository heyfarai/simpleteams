"use client";

import {
  ComparisonTable,
  PackageGrid,
  PricingTable,
  usePackageComparison,
} from "./package-selection";
import type { PackageSelectionStepProps } from "./package-selection";

export function PackageSelectionStep({
  selectedPackage,
  onPackageSelect,
  onNext,
}: PackageSelectionStepProps) {
  const { packages } = usePackageComparison();

  const handlePackageSelect = (packageId: string) => {
    onPackageSelect(packageId);

    // Auto-advance to next step after a short delay to show selection (only if onNext is provided)
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 100);
    }
  };

  return (
    <div className="space-y-6 mt-16">
      <div className="hidden text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Package
        </h2>
        <p className="text-gray-600">
          Select the registration package that works best for your team
        </p>
      </div>

      {/* Package Selection Cards */}
      <PackageGrid
        packages={packages}
        selectedPackage={selectedPackage}
        onPackageSelect={handlePackageSelect}
      />
      {/* Official Pricing Table */}
      <PricingTable />
      {/* Comparison Table */}
      <ComparisonTable />
    </div>
  );
}
