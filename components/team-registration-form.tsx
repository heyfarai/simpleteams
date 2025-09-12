"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import step components
import { ProgressSteps } from "./registration/progress-steps";
import { TeamInfoStep } from "./registration/team-info-step";
import { ContactStep } from "./registration/contact-step";
import { ReviewStep } from "./registration/review-step";
import { SuccessStep } from "./registration/success-step";


interface FormData {
  teamName: string;
  city: string;
  province: string;
  contactEmail: string;
  logo: File | null;
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
}

export function TeamRegistrationForm() {
  const [paymentPlan, setPaymentPlan] = useState<
    "full" | "deposit_plus_payments"
  >("full");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    teamName: "",
    city: "",
    province: "",
    contactEmail: "",
    logo: null,
    primaryColors: ["#1e40af", "#fbbf24"],
    divisionPreference: "",
    registrationNotes: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactRole: "manager",
    headCoachName: "",
    headCoachEmail: "",
    headCoachPhone: "",
    headCoachCertifications: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.primaryColors];
    newColors[index] = color;
    setFormData((prev) => ({ ...prev, primaryColors: newColors }));
  };

  const addColor = () => {
    if (formData.primaryColors.length < 3) {
      setFormData((prev) => ({
        ...prev,
        primaryColors: [...prev.primaryColors, "#000000"],
      }));
    }
  };

  const removeColor = (index: number) => {
    if (formData.primaryColors.length > 1) {
      const newColors = formData.primaryColors.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, primaryColors: newColors }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.teamName &&
          formData.city &&
          formData.province &&
          formData.contactEmail &&
          formData.divisionPreference
        );
      case 2:
        return (
          formData.primaryContactName &&
          formData.primaryContactEmail &&
          formData.headCoachName &&
          formData.headCoachEmail
        );
      case 3:
        return true; // Review step
      case 4:
        return true; // Success step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormData({
      teamName: "",
      city: "",
      province: "",
      contactEmail: "",
      logo: null,
      primaryColors: ["#1e40af", "#fbbf24"],
      divisionPreference: "",
      registrationNotes: "",
      primaryContactName: "",
      primaryContactEmail: "",
      primaryContactPhone: "",
      primaryContactRole: "manager",
      headCoachName: "",
      headCoachEmail: "",
      headCoachPhone: "",
      headCoachCertifications: "",
    });
    setLogoPreview(null);
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

  // Load cart when email changes
  useEffect(() => {
    if (formData.contactEmail) {
      loadCart(formData.contactEmail);
    }
  }, [formData.contactEmail]);

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
        paymentPlan,
      };


      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: registrationData }),
      });

      const data = await res.json();
      if (!res.ok) {
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
    switch (currentStep) {
      case 1:
        return (
          <TeamInfoStep
            formData={formData}
            logoPreview={logoPreview}
            onInputChange={handleInputChange}
            onLogoUpload={handleLogoUpload}
            onColorChange={handleColorChange}
            onAddColor={addColor}
            onRemoveColor={removeColor}
          />
        );
      case 2:
        return (
          <ContactStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={formData}
            paymentPlan={paymentPlan}
            onPaymentPlanChange={setPaymentPlan}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return (
          <SuccessStep
            formData={formData}
            onStartOver={handleStartOver}
          />
        );
      default:
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
          {currentStep < 3 && (
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
