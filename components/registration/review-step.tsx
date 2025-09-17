"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveDivisions } from "@/hooks/use-active-divisions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectedPackageDisplay } from "./selected-package-display";
import { Building, MapPin, Mail, Trophy, User, Phone, Users, Palette, FileText } from "lucide-react";

interface ReviewStepProps {
  formData: {
    selectedPackage: string;
    teamName: string;
    city: string;
    province: string;
    contactEmail: string;
    primaryColors: string[];
    divisionPreference: string;
    registrationNotes: string;
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactPhone: string;
    primaryContactRole: string;
    headCoachName: string;
    headCoachEmail: string;
    headCoachPhone: string;
    headCoachCertifications: string;
  };
  paymentPlan: 'full' | 'deposit_plus_payments';
  onPaymentPlanChange: (plan: 'full' | 'deposit_plus_payments') => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onGoToPrevious?: () => void;
}

export function ReviewStep({
  formData,
  paymentPlan,
  onPaymentPlanChange,
  onSubmit,
  isSubmitting,
  onGoToPrevious,
}: ReviewStepProps) {
  const { data: activeDivisions } = useActiveDivisions();
  
  const selectedDivision = activeDivisions?.find(
    (d) => d.division._id === formData.divisionPreference
  );

  return (
    <div className="space-y-6">
      {/* Selected Package Display */}
      {formData.selectedPackage && (
        <SelectedPackageDisplay
          selectedPackage={formData.selectedPackage}
          onChangePackage={onGoToPrevious}
          showChangeButton={false}
        />
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Registration Summary
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Team Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="w-4 h-4" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Team Name:</span>
                <span className="text-sm font-medium">{formData.teamName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium">
                  {formData.city && formData.province 
                    ? `${formData.city}, ${formData.province}` 
                    : formData.city || formData.province || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contact Email:</span>
                <span className="text-sm font-medium">{formData.contactEmail || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Division:</span>
                <span className="text-sm font-medium">
                  {selectedDivision ? selectedDivision.division.name : formData.divisionPreference || 'Not selected'}
                </span>
              </div>
              {formData.primaryColors && formData.primaryColors.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Colors:</span>
                  <div className="flex gap-1">
                    {formData.primaryColors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Primary Contact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" />
                Primary Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium">{formData.primaryContactName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{formData.primaryContactEmail || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium">{formData.primaryContactPhone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <span className="text-sm font-medium capitalize">{formData.primaryContactRole || 'Not specified'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Head Coach */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4" />
                Head Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium">{formData.headCoachName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{formData.headCoachEmail || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium">{formData.headCoachPhone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Certifications:</span>
                <span className="text-sm font-medium">{formData.headCoachCertifications || 'None listed'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          {formData.registrationNotes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{formData.registrationNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Payment</h3>

        {(() => {
          const getPackagePrice = () => {
            switch (formData.selectedPackage) {
              case "full-season":
                return { amount: 3495, originalAmount: 3795, label: "Full Season Team Registration" };
              case "two-session":
                return { amount: 1795, label: "Two Session Pack Registration" };
              case "pay-per-session":
                return { amount: 795, label: "Pay Per Session Registration" };
              default:
                return { amount: 3495, label: "Registration Fee" };
            }
          };

          const packagePrice = getPackagePrice();

          return (
            <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{packagePrice.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete payment to finalize your registration
                  </p>
                  {packagePrice.originalAmount && (
                    <p className="text-sm text-green-600 mt-1">
                      Early bird discount: Save ${(packagePrice.originalAmount - packagePrice.amount).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {packagePrice.originalAmount && (
                    <div className="text-sm text-gray-500 line-through">
                      ${packagePrice.originalAmount.toLocaleString()}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-blue-600">
                    ${packagePrice.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <Button
          type="button"
          onClick={() => {
            onPaymentPlanChange("full"); // Ensure full payment is selected
            onSubmit();
          }}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isSubmitting ? "Processing..." : "Complete Registration & Pay"}
        </Button>
      </div>
    </div>
  );
}
