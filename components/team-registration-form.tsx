"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServiceStatus } from "@/hooks/use-service-status";
import { toast } from "sonner";
import { useRouter, useSearchParams, useParams } from "next/navigation";

// Import step components
import { ProgressSteps } from "./registration/progress-steps";
import { PackageSelectionStep } from "./registration/package-selection-step";
import { TeamInfoStep } from "./registration/team-info-step";
import { ContactStep } from "./registration/contact-step";
import { ReviewStep } from "./registration/review-step";
import { SuccessStep } from "./registration/success-step";


interface FormData {
  selectedPackage: string;
  teamName: string;
  city: string;
  province: string;
  contactEmail: string;
  divisionPreference: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  primaryContactRole: string;
  headCoachName: string;
  headCoachEmail: string;
  headCoachPhone: string;
  headCoachCertifications: string;
}

export function TeamRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const [paymentPlan, setPaymentPlan] = useState<
    "full" | "deposit_plus_payments"
  >("full");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get step from URL route parameter, default to 1
  const urlStep = parseInt((params.step as string) || '1');
  const [currentStep, setCurrentStep] = useState(Math.max(1, Math.min(4, urlStep)));

  // Service status monitoring
  useServiceStatus();

  const totalSteps = 4;

  // Sync URL changes with component state
  useEffect(() => {
    const newStep = parseInt((params.step as string) || '1');
    const validStep = Math.max(1, Math.min(4, newStep));
    if (validStep !== currentStep) {
      setCurrentStep(validStep);
    }
  }, [params.step, currentStep]);

  // Handle package parameter separately to avoid circular dependency
  useEffect(() => {
    const urlPackage = searchParams.get('package') || '';
    if (urlPackage && !formData.selectedPackage) {
      setFormData(prev => ({ ...prev, selectedPackage: urlPackage }));
    }
  }, [searchParams]);

  // Browser back/forward handling
  useEffect(() => {
    const handlePopState = () => {
      // URL has already changed, just sync the component state
      const pathSegments = window.location.pathname.split('/');
      const stepFromPath = pathSegments[pathSegments.length - 1];
      const newStep = parseInt(stepFromPath || '1');
      const validStep = Math.max(1, Math.min(4, newStep));
      setCurrentStep(validStep);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update page title based on step
  useEffect(() => {
    const stepTitles = {
      1: "Team Information",
      2: "Contact Information",
      3: "Review & Payment",
      4: "Registration Complete"
    };

    document.title = `${stepTitles[currentStep as keyof typeof stepTitles]} - Basketball League Registration`;
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (validateStep(currentStep)) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const [formData, setFormData] = useState<FormData>({
    selectedPackage: "",
    teamName: "",
    city: "",
    province: "",
    contactEmail: "",
    divisionPreference: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactRole: "manager",
    headCoachName: "",
    headCoachEmail: "",
    headCoachPhone: "",
    headCoachCertifications: "",
  });

  // Prevent page leave if form has data
  useEffect(() => {
    const hasFormData = formData.teamName || formData.selectedPackage || formData.contactEmail;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormData && currentStep < 5) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (hasFormData && currentStep < 5) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData.teamName, formData.selectedPackage, formData.contactEmail, currentStep]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!(
          formData.contactEmail &&
          formData.teamName &&
          formData.city &&
          formData.province &&
          formData.divisionPreference
        );
      case 2:
        return !!(
          formData.primaryContactName &&
          formData.primaryContactEmail &&
          formData.headCoachName &&
          formData.headCoachEmail
        );
      case 3:
        return formData.selectedPackage !== ""; // Review step now includes package selection
      case 4:
        return true; // Success step
      default:
        return false;
    }
  };

  // Update URL when step changes
  const updateStep = (newStep: number) => {
    const params = new URLSearchParams(searchParams.toString());
    // Preserve package in URL to prevent data loss
    if (formData.selectedPackage && !params.get('package')) {
      params.set('package', formData.selectedPackage);
    }

    const newUrl = `/register/step/${newStep}?${params.toString()}`;
    console.log('updateStep called', {
      currentStep,
      newStep,
      newUrl,
      formData: { selectedPackage: formData.selectedPackage }
    });

    router.push(newUrl, { scroll: false });
    setCurrentStep(newStep);

    console.log('After updateStep - currentStep should be:', newStep);
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    const canProceed = currentStep < totalSteps;

    console.log('handleNext called', {
      currentStep,
      isValid,
      canProceed,
      totalSteps,
      condition: isValid && canProceed,
      formData: {
        contactEmail: formData.contactEmail,
        teamName: formData.teamName,
        city: formData.city,
        province: formData.province,
        divisionPreference: formData.divisionPreference
      }
    });

    if (isValid && canProceed) {
      console.log('Navigation proceeding to step', currentStep + 1);
      updateStep(currentStep + 1);
    } else {
      console.log('Navigation blocked', { isValid, canProceed });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  };

  const handleStartOver = () => {
    updateStep(1);
    setFormData({
      selectedPackage: "",
      teamName: "",
      city: "",
      province: "",
      contactEmail: "",
      divisionPreference: "",
      primaryContactName: "",
      primaryContactEmail: "",
      primaryContactPhone: "",
      primaryContactRole: "manager",
      headCoachName: "",
      headCoachEmail: "",
      headCoachPhone: "",
      headCoachCertifications: "",
    });
    setIsSubmitting(false);
  };

  const saveCart = async () => {
    if (formData.contactEmail) {
      try {
        await fetch("/api/registration/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.contactEmail,
            formData,
            step: currentStep,
          }),
        });
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    }
  };

  const loadCart = async (email: string) => {
    try {
      const res = await fetch(`/api/registration/cart?email=${email}`);
      
      if (res.ok) {
        const cart = await res.json();
        
        if (cart && cart.form_data) {
          // Only update form data if it has meaningful content
          const hasContent = cart.form_data.teamName || cart.form_data.city || cart.form_data.province;
          if (hasContent) {
            setFormData(prev => ({ ...prev, ...cart.form_data }));
            // Only update step if it's reasonable (don't jump to final steps)
            if (cart.step && cart.step <= currentStep + 1) {
              setCurrentStep(cart.step);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  // Check for payment success on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      // User returned from successful payment
      setCurrentStep(4);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load cart when email changes - DISABLED to prevent navigation issues
  // useEffect(() => {
  //   if (formData.contactEmail) {
  //     loadCart(formData.contactEmail);
  //   }
  // }, [formData.contactEmail]);

  // Debounced cart save
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCart();
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
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
        paymentPlan,
      };


      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: registrationData }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Handle specific error types
        if (data.error === "duplicate_email") {
          toast.error("Email Already Registered", {
            description: data.message,
            duration: 10000,
            action: {
              label: "Need help?",
              onClick: () => {
                // You could redirect to login or show contact info here
                console.log("User needs help with existing account");
              }
            }
          });
          return; // Don't throw, just show the toast and return
        }

        throw new Error(data.error || "Failed to submit registration");
      }

      if (data.checkoutUrl) {
        // Store the checkout URL and navigate to payment
        // After payment, user will return to success step
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    console.log('renderCurrentStep called with currentStep:', currentStep);

    switch (currentStep) {
      case 1:
        console.log('Rendering Step 1 - TeamInfoStep');
        return (
          <TeamInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            onGoToPrevious={handlePrevious}
          />
        );
      case 2:
        console.log('Rendering Step 2 - ContactStep');
        return (
          <ContactStep
            formData={formData}
            onInputChange={handleInputChange}
            onGoToPrevious={handlePrevious}
          />
        );
      case 3:
        console.log('Rendering Step 3 - ReviewStep');
        return (
          <ReviewStep
            formData={formData}
            paymentPlan={paymentPlan}
            onPaymentPlanChange={setPaymentPlan}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onGoToPrevious={handlePrevious}
            onPackageSelect={(packageId) => handleInputChange("selectedPackage", packageId)}
          />
        );
      case 4:
        console.log('Rendering Step 4 - SuccessStep');
        return (
          <SuccessStep
            formData={formData}
            onStartOver={handleStartOver}
          />
        );
      default:
        console.log('Rendering default (null) for step:', currentStep);
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressSteps
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <Card>
        <CardHeader></CardHeader>
        <CardContent className="space-y-2">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          {currentStep === 1 && (
            <div className="flex justify-end pt-6">
              <Button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add team contacts →
              </Button>
            </div>
          )}
          {currentStep > 1 && currentStep < 3 && (
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
