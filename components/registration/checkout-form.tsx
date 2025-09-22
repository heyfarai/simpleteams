"use client";

import { useState, useEffect } from "react";
import { useServiceStatus } from "@/hooks/use-service-status";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useRegistrationForm } from "@/hooks/use-registration-form";
import { getPackageDetails } from "./utils/packageDetails";
import { TeamInformationSection } from "./components/TeamInformationSection";
import { DivisionSection } from "./components/DivisionSection";
import { ContactInformationSection } from "./components/ContactInformationSection";
import { OrderSummary } from "./components/OrderSummary";
import { MobileSummary } from "./components/MobileSummary";
import { SignInModal } from "./components/SignInModal";


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
    handleSubmit,
  } = useRegistrationForm();

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
