"use client";

import { useState } from "react";
import {
  ComparisonTable,
  PackageGrid,
  PricingTable,
} from "./package-selection";
import { usePackageComparison } from "@/hooks/use-package-comparison";
import type { PackageSelectionStepProps } from "./package-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PackageSelectionStep({
  selectedPackage,
  onPackageSelect,
  onNext,
}: PackageSelectionStepProps) {
  const { packages } = usePackageComparison();
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installments'>('full');

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
          Choose Your 2025-26 Package
        </h2>
        <p className="text-gray-600">
          Select the registration package that works best for your team
        </p>
      </div>

      {/* Payment Method Toggle */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose Your Payment Method</h3>
            <div className="flex justify-center space-x-4">
              <Button
                variant={paymentMethod === 'full' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('full')}
                className="px-8"
              >
                Pay Full Amount
              </Button>
              <Button
                variant={paymentMethod === 'installments' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('installments')}
                className="px-8"
              >
                Pay in Installments
              </Button>
            </div>
            {paymentMethod === 'installments' && (
              <p className="text-sm text-gray-600">
                Split your payment into 8 monthly installments. First payment due today.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Package Selection Cards */}
      <PackageGrid
        packages={packages}
        selectedPackage={selectedPackage}
        onPackageSelect={handlePackageSelect}
        paymentMethod={paymentMethod}
      />
      {/* Official Pricing Table */}
      <PricingTable />
      {/* Comparison Table */}
      <ComparisonTable />
    </div>
  );
}
