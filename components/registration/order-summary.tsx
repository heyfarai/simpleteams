import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { getInstallmentDetails, type PackageDetails } from "@/lib/config/packages";
import { usePaymentSchedule } from "@/hooks/use-payment-schedule";
import type { FormData } from "@/hooks/use-registration-form";
import type { Division } from "@/lib/domain/models";

interface OrderSummaryProps {
  formData: FormData;
  packageDetails: PackageDetails;
  selectedDivision: Division | undefined;
  isFormValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  paymentMethod?: "full" | "installments";
}

export function OrderSummary({
  formData,
  packageDetails,
  selectedDivision,
  isFormValid,
  isSubmitting,
  onSubmit,
  paymentMethod = "full",
}: OrderSummaryProps) {
  // Get installment details from config for any package that supports installments
  const installmentDetails = formData.selectedPackage
    ? getInstallmentDetails(formData.selectedPackage as any)
    : null;

  // Get real payment dates from Stripe
  const { paymentDates } = usePaymentSchedule({
    packageType: formData.selectedPackage as any,
    paymentMethod,
  });

  return (
    <div className="sticky top-8">
      <div className="p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-0">
            <CreditCard className="h-5 w-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 md:space-y-4 px-6">
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

          {/* Installment Schedule */}
          {paymentMethod === "installments" && installmentDetails && (
            <div className="space-y-3 pt-4 border-t border-primary/10">
              <h4 className="font-medium">Payment Schedule</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Today</span>
                  <span className="font-bold">
                    ${installmentDetails.installmentAmount.toLocaleString()}
                  </span>
                </div>
                {paymentDates.length > 0 ? (
                  paymentDates.map((date, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{date}</span>
                      <span>
                        ${installmentDetails.installmentAmount.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between ">
                    <span>Months 2-{installmentDetails.installments}</span>
                    <span>
                      ${installmentDetails.installmentAmount.toLocaleString()}
                      /month
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-6 border-t border-primary/10">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {paymentMethod === "installments" && installmentDetails
                  ? "Due Today"
                  : "Total"}
              </span>
              <span className="font-bold">
                {paymentMethod === "installments" && installmentDetails
                  ? `$${installmentDetails.installmentAmount.toLocaleString()}`
                  : `$${packageDetails.amount.toLocaleString()}`}
              </span>
            </div>
            {paymentMethod === "installments" && installmentDetails && (
              <div className="text-sm text-right mt-1">
                Total: ${installmentDetails.totalAmount.toLocaleString()}
              </div>
            )}
          </div>

          {/* Payment Button */}
          <Button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-primary/80 hover:bg-primary-700 text-white"
            size="lg"
          >
            {isSubmitting
              ? "Processing..."
              : paymentMethod === "installments" && installmentDetails
              ? "Start Installment Plan"
              : "Complete Registration & Pay"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By completing this registration, you agree to our terms and
            conditions.
          </p>
        </CardContent>
      </div>
    </div>
  );
}
