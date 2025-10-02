"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { getPackageDisplayDetails } from "@/lib/config/packages";

interface SelectedPackageDisplayProps {
  selectedPackage: string;
  onChangePackage?: () => void;
  showChangeButton?: boolean;
}

export function SelectedPackageDisplay({
  selectedPackage,
  onChangePackage,
  showChangeButton = true,
}: SelectedPackageDisplayProps) {
  const packageDetails = getPackageDisplayDetails(selectedPackage);

  if (!packageDetails) {
    return null;
  }

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">
                  {packageDetails.name}
                </h4>
                {packageDetails.isRecommended && (
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    {packageDetails.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-lg text-blue-600">
                  {packageDetails.price}
                </span>
                {packageDetails.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {packageDetails.originalPrice}
                  </span>
                )}
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">
                  {packageDetails.games}
                </span>
              </div>
              {packageDetails.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {packageDetails.description}
                </p>
              )}
            </div>
          </div>
          {showChangeButton && onChangePackage && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChangePackage}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Package
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
