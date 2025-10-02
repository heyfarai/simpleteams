"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";
import { getInstallmentDetails, isInstallmentAvailable } from "@/lib/config/packages";
import type { PackageOption } from "./types";

interface PackageCardProps {
  package: PackageOption;
  isSelected: boolean;
  onClick: (packageId: string) => void;
  paymentMethod?: "full" | "installments";
}

export function PackageCard({
  package: pkg,
  isSelected,
  onClick,
  paymentMethod = "full",
}: PackageCardProps) {
  // Get installment details from config
  const installmentDetails = getInstallmentDetails(pkg.id as any);
  const hasInstallments = isInstallmentAvailable(pkg.id as any);

  const renderFeatureIcon = (feature: PackageOption["features"][0]) => {
    if (feature.included) {
      return <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />;
    }

    if (
      feature.text.includes("cost extra") ||
      feature.text.includes("No priority") ||
      feature.text.includes("Higher cost")
    ) {
      return <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />;
    }

    return (
      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
    );
  };

  return (
    <div className="relative h-full">
      <Card
        className={`bg-white h-full flex flex-col ${
          pkg.isRecommended ? "mt-0" : ""
        } ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""} ${
          pkg.isRecommended ? "" : ""
        }`}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-0">{pkg.name}</h3>
            <p className="text-sm ">{pkg.games}</p>
            <div className="price-container mt-3 flex flex-row justify-between items-end">
              {paymentMethod === "installments" && hasInstallments && installmentDetails ? (
                <div className="flex flex-col w-full">
                  <span className="text-3xl font-bold">
                    ${installmentDetails.installmentAmount.toLocaleString()}{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      /month
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {installmentDetails.installments} payments (${installmentDetails.totalAmount.toLocaleString()} total)
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-3xl font-bold">
                    ${pkg.price.toLocaleString()}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${pkg.originalPrice.toLocaleString()}
                    </span>
                  )}
                </>
              )}
              {pkg.isRecommended && (
                <div className="hidden top-0 left-1/2 transform z-20 mb-2">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    {pkg.badge}
                  </span>
                </div>
              )}
              {pkg.description && !pkg.isRecommended && (
                <p className="text-sm text-gray-500 mb-2">{pkg.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6 flex-grow border-t pt-8 mt-2 pb-4">
            {pkg.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                {renderFeatureIcon(feature)}
                <span
                  className={`text-sm ${
                    feature.highlight
                      ? "font-semibold"
                      : feature.included
                      ? "text-gray-700"
                      : "text-gray-500"
                  }`}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => onClick(pkg.id)}
            className={`cursor-pointer w-full mt-auto transition-all duration-200 bg-foreground text-[#ff9408] hover:text-foreground hover:bg-secondary`}
            size="lg"
          >
            {paymentMethod === "installments" && hasInstallments && installmentDetails
              ? `Pay in ${installmentDetails.installments} installments`
              : `Register with ${pkg.name}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
