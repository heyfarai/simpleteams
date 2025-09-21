import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import type { FormData, Division } from "@/hooks/use-registration-form";
import type { PackageDetails } from "../utils/packageDetails";

interface OrderSummaryProps {
  formData: FormData;
  packageDetails: PackageDetails;
  selectedDivision: Division | undefined;
  isFormValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function OrderSummary({
  formData,
  packageDetails,
  selectedDivision,
  isFormValid,
  isSubmitting,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-8">
      <Card className="bg-secondary text-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-0">
            <CreditCard className="h-5 w-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-6">
          {/* Package Details */}
          {formData.selectedPackage && (
            <div className="space-y-3">
              <div className="flex justify-between mb-0">
                <span className="font-bold">{packageDetails.name}</span>
                <div className="text-right">
                  {packageDetails.originalAmount && (
                    <div className="text-sm text-gray-500 line-through">
                      ${packageDetails.originalAmount.toLocaleString()}
                    </div>
                  )}
                  <div className="font-bold">
                    ${packageDetails.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#f3f4f5] mt-0">
                {packageDetails.description}
              </p>
              {packageDetails.originalAmount && (
                <Badge variant="secondary" className="text-green-700 bg-green-50">
                  Save $
                  {(
                    packageDetails.originalAmount - packageDetails.amount
                  ).toLocaleString()}
                </Badge>
              )}
            </div>
          )}

          {/* Registration Details */}
          <div className="space-y-3 pt-0 ">
            {formData.teamName && (
              <div className="flex justify-between text-sm">
                <span>Team</span>
                <span className="font-bold">{formData.teamName}</span>
              </div>
            )}
            {selectedDivision && (
              <div className="flex justify-between text-sm">
                <span>Division</span>
                <span className="font-bold">{selectedDivision.name}</span>
              </div>
            )}
            {(formData.city || formData.province) && (
              <div className="flex justify-between text-sm">
                <span>Location</span>
                <span className="font-bold">
                  {[formData.city, formData.province]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {formData.contactEmail && (
              <div className="flex justify-between text-sm">
                <span>Contact</span>
                <span className="font-bold">{formData.contactEmail}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="pt-6 border-t border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold">
                ${packageDetails.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-primary/80 hover:bg-primary-700 text-white"
            size="lg"
          >
            {isSubmitting ? "Processing..." : "Complete Registration & Pay"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By completing this registration, you agree to our terms and
            conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}