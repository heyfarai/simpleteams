"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveDivisions } from "@/hooks/use-active-divisions";

interface ReviewStepProps {
  formData: {
    teamName: string;
    city: string;
    province: string;
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
}

export function ReviewStep({
  formData,
  paymentPlan,
  onPaymentPlanChange,
  onSubmit,
  isSubmitting,
}: ReviewStepProps) {
  const { data: activeDivisions } = useActiveDivisions();
  
  const selectedDivision = activeDivisions?.find(
    (d) => d.division._id === formData.divisionPreference
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Review Registration
        </h3>

        <div className="space-y-6">
          {/* Team Information Summary */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Team Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Team Name:</span>
                <span className="ml-2 font-medium">{formData.teamName}</span>
              </div>
              <div>
                <span className="text-gray-500">Location:</span>
                <span className="ml-2 font-medium">
                  {formData.city}, {formData.province}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-4">
              <span className="text-gray-500">Colors:</span>
              <div className="flex space-x-2">
                {formData.primaryColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Division Preference */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Division Preference
            </h4>
            <div className="text-sm">
              <span className="text-gray-500">Preferred Division:</span>
              <span className="ml-2 font-medium">
                {selectedDivision?.division ? 
                  `${selectedDivision.division.name} - ${selectedDivision.division.ageGroup}` : 
                  'Not selected'
                }
              </span>
            </div>
            {formData.registrationNotes && (
              <div className="mt-3">
                <span className="text-gray-500">Notes:</span>
                <p className="text-sm text-gray-900 mt-1">
                  {formData.registrationNotes}
                </p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Primary Contact
                </h5>
                <div className="space-y-1">
                  <div>{formData.primaryContactName}</div>
                  <div className="text-gray-600">
                    {formData.primaryContactEmail}
                  </div>
                  {formData.primaryContactPhone && (
                    <div className="text-gray-600">
                      {formData.primaryContactPhone}
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {formData.primaryContactRole
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Head Coach</h5>
                <div className="space-y-1">
                  <div>{formData.headCoachName}</div>
                  <div className="text-gray-600">{formData.headCoachEmail}</div>
                  {formData.headCoachPhone && (
                    <div className="text-gray-600">
                      {formData.headCoachPhone}
                    </div>
                  )}
                  {formData.headCoachCertifications && (
                    <div className="text-xs text-gray-500">
                      {formData.headCoachCertifications}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Payment Options</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  paymentPlan === "full"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
                onClick={() => onPaymentPlanChange("full")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">Full Payment</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay the entire registration fee now
                    </p>
                  </div>
                  <div className="text-lg font-bold">$3,795</div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  paymentPlan === "deposit_plus_payments"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
                onClick={() => onPaymentPlanChange("deposit_plus_payments")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">Deposit + Payments</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay $1,000 deposit now, rest in installments
                    </p>
                  </div>
                  <div className="text-lg font-bold">$1,000</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
