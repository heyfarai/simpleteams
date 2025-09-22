import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { divisionService } from "@/lib/services/division-service";
import type { Division } from "@/lib/domain/models";

export interface FormData {
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

const fetchDivisions = async (): Promise<Division[]> => {
  return await divisionService.getActiveDivisions();
};

export function useRegistrationForm() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: divisions = [],
    isLoading: divisionsLoading,
    error: divisionsError,
  } = useQuery<Division[]>({
    queryKey: ["divisions"],
    queryFn: fetchDivisions,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState<FormData>({
    selectedPackage: searchParams.get("package") || "",
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

  // Set authenticated user's email as contact email and primary contact email
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        contactEmail: user.email || "",
        primaryContactEmail: user.email || "",
      }));
    }
  }, [user?.email]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return !!(
      formData.selectedPackage &&
      formData.teamName &&
      formData.city &&
      formData.province &&
      formData.contactEmail &&
      formData.divisionPreference &&
      formData.primaryContactName &&
      formData.primaryContactEmail
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting || !isFormValid()) return;

    if (isSubmitting) {
      toast.error("Submission in progress", {
        description: "Please wait while we process your registration.",
      });
      return;
    }

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
        paymentPlan: "full",
        userId: user?.id,
      };

      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: registrationData }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "duplicate_email") {
          toast.error("Email Already Registered", {
            description: data.message,
            duration: 10000,
            action: {
              label: "Need help?",
              onClick: () => {},
            },
          });
          return;
        }

        throw new Error(data.error || "Failed to submit registration");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleInputChange,
    divisions,
    divisionsLoading,
    divisionsError,
    isSubmitting,
    isFormValid,
    handleSubmit,
  };
}