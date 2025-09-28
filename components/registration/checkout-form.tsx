"use client";

import { useState, useEffect } from "react";
import { useServiceStatus } from "@/hooks/use-service-status";
import { useAuth } from "@/hooks/use-auth";
import { useRegistrationForm } from "@/hooks/use-registration-form";
import { useInstallmentPreference } from "@/hooks/use-installment-preference";
import { useCurrentSeasonId } from "@/lib/hooks/use-current-season";
import { getPackageDetails } from "@/lib/config/packages";
import { ContactEmailSection } from "./contact-email-section";
import { TeamInformationSection } from "./team-information-section";
import { DivisionSection } from "./division-section";
import { ContactInformationSection } from "./contact-information-section";
import { OrderSummary } from "./order-summary";
import { MobileSummary } from "./mobile-summary";
import { SignInModal } from "./sign-in-modal";
import { SessionSelection } from "./session-selection";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPackageConfig,
  isInstallmentAvailable,
  type PackageType,
} from "@/lib/config/packages";

export function CheckoutForm() {
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInModalEmail, setSignInModalEmail] = useState<string>("");
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);

  // Check for payment method in URL parameters
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const paymentFromUrl = searchParams.get("payment");

  // Service status monitoring
  useServiceStatus();

  // Get current season ID from database
  const currentSeasonId = useCurrentSeasonId();

  const {
    formData,
    handleInputChange,
    divisions,
    divisionsLoading,
    divisionsError,
    isSubmitting,
    isFormValid,
  } = useRegistrationForm();

  // Get payment method from user preferences
  const packageForPreference = (formData.selectedPackage ||
    "full-season") as PackageType;
  const { isInstallmentEnabled } = useInstallmentPreference(
    packageForPreference,
    user?.id
  );

  // Determine payment method based on URL parameter, preferences, and availability
  const installmentsAvailable = isInstallmentAvailable(packageForPreference);

  // Priority: URL parameter > saved preferences > default to installments if available
  let paymentMethod: "full" | "installments" = "full";
  if (paymentFromUrl === "installments" && installmentsAvailable) {
    paymentMethod = "installments";
  } else if (paymentFromUrl === "full") {
    paymentMethod = "full";
  } else if (isInstallmentEnabled && installmentsAvailable) {
    paymentMethod = "installments";
  } else if (installmentsAvailable) {
    // Default to installments if available and no explicit preference is set
    paymentMethod = "installments";
  }

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
        selectedSessionIds:
          selectedSessionIds.length > 0 ? selectedSessionIds : undefined,
        paymentMethod: paymentMethod, // Use our local state
        userId: user?.id,
      };

      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: registrationData,
          currentUrl: window.location.href,
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
        // Provide immediate feedback before reload
        const toastModule = import("sonner");
        toastModule.then(({ toast }) => {
          toast.success("Email verified successfully!", {
            description:
              "Your form is now unlocked. Please complete your registration.",
            duration: 3000,
          });
        });

        // Small delay to show the toast before reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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

  const handleShowSignIn = (email?: string) => {
    setSignInModalEmail(email || formData.contactEmail);
    setShowSignInModal(true);
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
              {/* TODO: Remove once summary has full schedule */}
              {installmentsAvailable && (
                <Card className="hidden bg-blue-50 border-blue-200 mb-6">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Payment Method
                      </h3>
                      <div className="flex justify-center items-center space-x-2">
                        <span className="text-sm text-gray-700">
                          You chose:
                        </span>
                        <span className="font-semibold text-blue-600">
                          {paymentMethod === "installments"
                            ? "Monthly Installments"
                            : "Pay in Full"}
                        </span>
                      </div>
                      {paymentMethod === "installments" && (
                        <div className="bg-white/70 rounded-lg p-4 border">
                          <p className="text-sm text-gray-700">
                            {getPackageConfig()[packageForPreference]
                              ?.installments &&
                              `Split into ${
                                getPackageConfig()[packageForPreference]!
                                  .installments!.installments
                              } monthly payments. First payment due today.`}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        <a
                          href="/register"
                          className="underline hover:text-gray-700"
                        >
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
                  <ContactEmailSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onShowSignIn={handleShowSignIn}
                  />

                  <TeamInformationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    disabled={!user}
                  />

                  <DivisionSection
                    formData={formData}
                    divisions={divisions}
                    divisionsLoading={divisionsLoading}
                    divisionsError={divisionsError}
                    onInputChange={handleInputChange}
                    disabled={!user}
                  />

                  {/* Session Selection for session-based packages */}
                  {formData.selectedPackage &&
                    ["two-session", "pay-per-session"].includes(
                      formData.selectedPackage
                    ) && (
                      <SessionSelection
                        packageType={
                          formData.selectedPackage as
                            | "two-session"
                            | "pay-per-session"
                        }
                        seasonId={currentSeasonId} // Dynamic active season from database
                        selectedSessionIds={selectedSessionIds}
                        onSelectionChange={setSelectedSessionIds}
                      />
                    )}

                  <ContactInformationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    disabled={!user}
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

        {/* Mobile Order Summary with Submit - Bottom */}
        <div className="lg:hidden mt-8 max-w-2xl mx-auto">
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

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        selectedPackage={formData.selectedPackage}
        initialEmail={signInModalEmail}
      />
    </div>
  );
}
