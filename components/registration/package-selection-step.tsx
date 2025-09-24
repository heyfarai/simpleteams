"use client";

import { useState, useEffect } from "react";
import {
  ComparisonTable,
  PackageGrid,
  PricingTable,
} from "./package-selection";
import { usePackageComparison } from "@/hooks/use-package-comparison";
import type { PackageSelectionStepProps } from "./package-selection";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentToggle } from "@/components/ui/payment-toggle";
import { useInstallmentPreference } from "@/hooks/use-installment-preference";
import { getPackageConfig, isInstallmentAvailable, getPackageInstallmentAmount, type PackageType } from "@/lib/config/packages";
import { useAuth } from "@/hooks/use-auth";

export function PackageSelectionStep({
  selectedPackage,
  onPackageSelect,
  onNext,
}: PackageSelectionStepProps) {
  const { packages } = usePackageComparison();
  const { user } = useAuth();

  // Use installment preference hook for the selected package (default to full-season if none selected)
  const packageForPreference = (selectedPackage || 'full-season') as PackageType;
  const { isInstallmentEnabled, setInstallmentPreference, isLoading } = useInstallmentPreference(
    packageForPreference,
    user?.id
  );

  // Initialize payment method from preferences
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installments'>('full');

  // Update payment method when preferences load
  useEffect(() => {
    if (!isLoading) {
      setPaymentMethod(isInstallmentEnabled ? 'installments' : 'full');
    }
  }, [isInstallmentEnabled, isLoading]);

  const handlePaymentMethodChange = (enabled: boolean) => {
    const newMethod = enabled ? 'installments' : 'full';
    setPaymentMethod(newMethod);
    setInstallmentPreference(enabled);
  };

  const handlePackageSelect = (packageId: string) => {
    onPackageSelect(packageId);

    // Auto-advance to next step after a short delay to show selection (only if onNext is provided)
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 100);
    }
  };

  // Check if installments are available for selected package
  const installmentsAvailable = selectedPackage ? isInstallmentAvailable(selectedPackage as PackageType) : true;

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
          <div className="text-center space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Choose Your Payment Method</h3>

            <PaymentToggle
              checked={paymentMethod === 'installments'}
              onChange={handlePaymentMethodChange}
              disabled={!installmentsAvailable || isLoading}
              leftLabel="Pay in Full"
              rightLabel="Monthly Installments"
              badgeText="Easier budgeting"
            />

            {paymentMethod === 'installments' && installmentsAvailable && (
              <div className="bg-white/70 rounded-lg p-4 border">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedPackage && getPackageConfig()[selectedPackage as PackageType]?.installments ?
                    `Split your payment into ${getPackageConfig()[selectedPackage as PackageType]!.installments!.installments} monthly payments of $${(getPackageInstallmentAmount(selectedPackage as PackageType) / 100).toFixed(2)} CAD. First payment due today.` :
                    "Split your payment into convenient monthly installments. First payment due today."
                  }
                </p>
              </div>
            )}

            {selectedPackage && !installmentsAvailable && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-700">
                  Installment payments are not available for this package. Only full payment is accepted.
                </p>
              </div>
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
