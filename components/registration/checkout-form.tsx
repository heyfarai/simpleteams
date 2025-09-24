"use client";

import { useState, useEffect } from "react";
import { useServiceStatus } from "@/hooks/use-service-status";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useRegistrationForm } from "@/hooks/use-registration-form";
import { useInstallmentPreference } from "@/hooks/use-installment-preference";
import { getPackageDetails } from "./utils/packageDetails";
import { TeamInformationSection } from "./components/TeamInformationSection";
import { DivisionSection } from "./components/DivisionSection";
import { ContactInformationSection } from "./components/ContactInformationSection";
import { OrderSummary } from "./components/OrderSummary";
import { MobileSummary } from "./components/MobileSummary";
import { SignInModal } from "./components/SignInModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPackageConfig, isInstallmentAvailable, type PackageType } from "@/lib/config/packages";


export function CheckoutForm() {
  const { user, signOut } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Service status monitoring
  useServiceStatus();

  const {
    formData,
    handleInputChange,
    divisions,
    divisionsLoading,
    divisionsError,
    isSubmitting,
    isFormValid,
    handleSubmit: originalHandleSubmit,
  } = useRegistrationForm();

  // Get payment method from user preferences
  const packageForPreference = (formData.selectedPackage || 'full-season') as PackageType;
  const { isInstallmentEnabled } = useInstallmentPreference(
    packageForPreference,
    user?.id
  );

  // Determine payment method based on preferences and availability
  const installmentsAvailable = isInstallmentAvailable(packageForPreference);
  const paymentMethod = (isInstallmentEnabled && installmentsAvailable) ? 'installments' : 'full';

  // Janky MVP: Override the submit to include payment method
  const handleSubmit = async () => {
    if (isSubmitting || !isFormValid()) return;

    try {
      const registrationData = {
        teamName: formData.teamName,
        contactEmail: formData.contactEmail,
        primaryContactName: formData.primaryContactName,
        primaryContactEmail: formData.primaryContactEmail,
        primaryContactPhone: formData.primaryContactPhone,
        primaryContactRole: formData.primaryContactRole,
        headCoachName: formData.headCoachName,
        headCoachEmail: formData.headCoachEmail,
        headCoachPhone: formData.headCoachPhone,
        headCoachCertifications: formData.headCoachCertifications,
        divisionPreference: formData.divisionPreference,
        city: formData.city,
        province: formData.province,
        selectedPackage: formData.selectedPackage,
        paymentMethod: paymentMethod, // Use our local state
        userId: user?.id,
      };

      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: registrationData,
          currentUrl: window.location.href
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Mark this as a registration tab and listen for auth success
  useEffect(() => {
    const tabId = `tab-${Date.now()}-${Math.random()}`;
    localStorage.setItem("registration-tab-id", tabId);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth-success") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      const currentStoredId = localStorage.getItem("registration-tab-id");
      if (currentStoredId === tabId) {
        localStorage.removeItem("registration-tab-id");
      }
    };
  }, []);

  const handleChangeEmail = async () => {
    try {
      await signOut();
      handleInputChange("contactEmail", "");
      setShowSignInModal(true);
      toast.success("Signed out successfully", {
        description: "You can now enter a different email address.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out", {
        description: "Please try again.",
      });
    }
  };

  const packageDetails = getPackageDetails(formData.selectedPackage);
  const selectedDivision = divisions.find(
    (d) => d.id === formData.divisionPreference
  );


  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 py-8">
        <MobileSummary
          formData={formData}
          packageDetails={packageDetails}
          selectedDivision={selectedDivision}
        />

        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          {/* Main Form Column */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl mx-auto lg:max-w-none">
              {/* Payment Method Display */}
              {installmentsAvailable && (
                <Card className="bg-blue-50 border-blue-200 mb-6">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                      <div className="flex justify-center items-center space-x-2">
                        <span className="text-sm text-gray-700">You chose:</span>
                        <span className="font-semibold text-blue-600">
                          {paymentMethod === 'installments' ? 'Monthly Installments' : 'Pay in Full'}
                        </span>
                      </div>
                      {paymentMethod === 'installments' && (
                        <div className="bg-white/70 rounded-lg p-4 border">
                          <p className="text-sm text-gray-700">
                            {getPackageConfig()[packageForPreference]?.installments &&
                              `Split into ${getPackageConfig()[packageForPreference]!.installments!.installments} monthly payments. First payment due today.`
                            }
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        <a href="/register" className="underline hover:text-gray-700">
                          ← Go back to change your payment preference
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="space-y-6 md:space-y-8">
                  <TeamInformationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onChangeEmail={handleChangeEmail}
                    onShowSignIn={() => setShowSignInModal(true)}
                  />

                  <DivisionSection
                    formData={formData}
                    divisions={divisions}
                    divisionsLoading={divisionsLoading}
                    divisionsError={divisionsError}
                    onInputChange={handleInputChange}
                  />

                  <ContactInformationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-5 mt-11">
            <OrderSummary
              formData={formData}
              packageDetails={packageDetails}
              selectedDivision={selectedDivision}
              isFormValid={isFormValid()}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        selectedPackage={formData.selectedPackage}
      />
    </div>
  );
}
