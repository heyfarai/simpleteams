"use client";

import { PackageCard } from "./PackageCard";
import type { PackageOption } from "./types";

interface PackageGridProps {
  packages: PackageOption[];
  selectedPackage: string;
  onPackageSelect: (packageId: string) => void;
  paymentMethod?: "full" | "installments";
}

export function PackageGrid({
  packages,
  selectedPackage,
  onPackageSelect,
  paymentMethod = "full",
}: PackageGridProps) {
  return (
    <div className="mb-36 md:mb-44 mt-4 md:mt-2">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            isSelected={selectedPackage === pkg.id}
            onClick={onPackageSelect}
            paymentMethod={paymentMethod}
          />
        ))}
      </div>
    </div>
  );
}
