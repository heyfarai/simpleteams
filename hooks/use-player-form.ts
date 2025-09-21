import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";

export interface PlayerForm {
  firstName: string;
  lastName: string;
  gradYear: string;
  hometown: string;
  position: "PG" | "SG" | "SF" | "PF" | "C" | "";
  jerseyNumber: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  bio: string;
  status: "active" | "inactive" | "injured";
}

export const initialFormData: PlayerForm = {
  firstName: "",
  lastName: "",
  gradYear: "",
  hometown: "",
  position: "",
  jerseyNumber: "",
  dateOfBirth: "",
  height: "",
  weight: "",
  bio: "",
  status: "active",
};

export function usePlayerForm(
  redirectPath: string,
  teamId?: string,
  seasonId?: string | null
) {
  const [formData, setFormData] = useState<PlayerForm>(initialFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: keyof PlayerForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.position) return "Position is required";

    if (formData.jerseyNumber && isNaN(Number(formData.jerseyNumber))) {
      return "Jersey number must be a number";
    }
    if (formData.weight && isNaN(Number(formData.weight))) {
      return "Weight must be a number";
    }
    if (formData.gradYear && isNaN(Number(formData.gradYear))) {
      return "Graduation year must be a number";
    }

    if (formData.gradYear) {
      const currentYear = new Date().getFullYear();
      const gradYear = Number(formData.gradYear);
      if (gradYear < 2020 || gradYear > currentYear + 10) {
        return "Graduation year must be between 2020 and " + (currentYear + 10);
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      if (!teamId) throw new Error("No team ID provided");

      const playerData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        personalInfo: {
          ...(formData.gradYear && { gradYear: Number(formData.gradYear) }),
          ...(formData.hometown.trim() && { hometown: formData.hometown.trim() }),
          position: formData.position,
          dateOfBirth: formData.dateOfBirth || undefined,
          height: formData.height.trim() || undefined,
          weight: formData.weight ? Number(formData.weight) : undefined,
        },
        jerseyNumber: formData.jerseyNumber
          ? Number(formData.jerseyNumber)
          : undefined,
        bio: formData.bio.trim() || undefined,
      };

      let rosterData = null;
      if (
        formData.jerseyNumber.trim() !== "" &&
        formData.position &&
        teamId &&
        seasonId
      ) {
        rosterData = {
          sanityTeamId: teamId,
          seasonId: seasonId,
          jerseyNumber: Number(formData.jerseyNumber),
          position: formData.position,
          status: formData.status,
        };
      }

      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerData,
          rosterData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create player");
      }

      // TODO: Handle photo upload to Sanity if needed
      if (photoFile) {
        // await uploadPhotoToSanity(photoFile, result.player._id)
      }

      router.push(redirectPath);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create player"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    photoFile,
    photoPreview,
    isSubmitting,
    error,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
    setFormData,
  };
}