import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { FormData, Division } from "@/hooks/use-registration-form";
import type { PackageDetails } from "../utils/packageDetails";

interface MobileSummaryProps {
  formData: FormData;
  packageDetails: PackageDetails;
  selectedDivision: Division | undefined;
}

export function MobileSummary({
  formData,
  packageDetails,
  selectedDivision,
}: MobileSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6 max-w-2xl mx-auto">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {formData.selectedPackage
            ? `${packageDetails.name} - $${packageDetails.amount.toLocaleString()}`
            : "Order Summary"}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      {isOpen && (
        <Card className="mt-4">
          <CardContent className="p-4 space-y-3">
            {/* Package Details */}
            {formData.selectedPackage && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">{packageDetails.name}</span>
                  <div className="text-right">
                    {packageDetails.originalAmount && (
                      <div className="text-sm text-gray-500 line-through">
                        ${packageDetails.originalAmount.toLocaleString()}
                      </div>
                    )}
                    <div className="font-medium">
                      ${packageDetails.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                {packageDetails.originalAmount && (
                  <Badge
                    variant="secondary"
                    className="text-green-700 bg-green-50"
                  >
                    Save $
                    {(
                      packageDetails.originalAmount - packageDetails.amount
                    ).toLocaleString()}
                  </Badge>
                )}
              </>
            )}

            {/* Registration Details */}
            {(formData.teamName ||
              formData.city ||
              selectedDivision ||
              formData.contactEmail) && (
              <div className="pt-3 border-t space-y-2">
                {formData.teamName && (
                  <div className="flex justify-between text-sm">
                    <span>Team:</span>
                    <span className="font-medium">{formData.teamName}</span>
                  </div>
                )}
                {(formData.city || formData.province) && (
                  <div className="flex justify-between text-sm">
                    <span>Location:</span>
                    <span className="font-medium">
                      {[formData.city, formData.province]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {selectedDivision && (
                  <div className="flex justify-between text-sm">
                    <span>Division:</span>
                    <span className="font-medium">{selectedDivision.name}</span>
                  </div>
                )}
                {formData.contactEmail && (
                  <div className="flex justify-between text-sm">
                    <span>Contact:</span>
                    <span className="font-medium">{formData.contactEmail}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}