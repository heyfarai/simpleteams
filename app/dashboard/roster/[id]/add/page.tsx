"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, User, Upload } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";

interface PlayerForm {
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

const initialFormData: PlayerForm = {
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

const positions = [
  { value: "PG", label: "Point Guard (PG)" },
  { value: "SG", label: "Shooting Guard (SG)" },
  { value: "SF", label: "Small Forward (SF)" },
  { value: "PF", label: "Power Forward (PF)" },
  { value: "C", label: "Center (C)" },
];

function AddPlayerForm() {
  const [formData, setFormData] = useState<PlayerForm>(initialFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const teamId = params.id as string;
  const seasonId = searchParams.get("season");

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

  // TODO: Implement photo upload to Sanity
  const uploadPhotoToSanity = async (
    file: File,
    playerId: string
  ): Promise<string | null> => {
    // This will be implemented later when we add Sanity asset upload
    return null;
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

    // Only validate graduation year if it's provided
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
      // Check if user is authenticated
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      // Check if team is selected
      if (!teamId) throw new Error("No team ID provided");


      // Prepare player data for API
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

      // Prepare roster data if adding to roster
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

      } else {
      }

      // Call API to create player
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

      router.push(`/dashboard/roster/${teamId}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create player"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/roster/${teamId}`}>
            <Button
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roster
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Player</h1>
            <p className="mt-1 text-sm text-gray-500">
              {teamId && seasonId
                ? `Add a new player to your team roster for the current season`
                : teamId
                ? "Add a new player (season not specified)"
                : "Please select a team first"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!teamId && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            Please select a team from the sidebar before adding a player.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gradYear">Graduation Year</Label>
                <Input
                  id="gradYear"
                  type="number"
                  value={formData.gradYear}
                  onChange={(e) =>
                    handleInputChange("gradYear", e.target.value)
                  }
                  placeholder="2025"
                />
              </div>
              <div>
                <Label htmlFor="hometown">Hometown</Label>
                <Input
                  id="hometown"
                  value={formData.hometown}
                  onChange={(e) =>
                    handleInputChange("hometown", e.target.value)
                  }
                  placeholder="City, Province"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basketball Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basketball Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="jerseyNumber">
                  Jersey Number{" "}
                  {seasonId && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  min="0"
                  max="99"
                  value={formData.jerseyNumber}
                  onChange={(e) =>
                    handleInputChange("jerseyNumber", e.target.value)
                  }
                  placeholder=""
                />
                {seasonId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Required to add to roster
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) =>
                    handleInputChange("position", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem
                        key={position.value}
                        value={position.value}
                      >
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="6'2&quot;"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="180"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Player Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              {photoPreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photoPreview}
                    alt="Player photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("photo")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a photo of the player (PNG, JPG, max 5MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Player Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Player background, achievements, playing style, etc..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Player Status */}
        <Card>
          <CardHeader>
            <CardTitle>Player Status</CardTitle>
            <p className="text-sm text-gray-500">
              {seasonId
                ? "Player status on the current season roster"
                : "Default player status"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Label htmlFor="status">Player Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange("status", value as PlayerForm["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href={`/dashboard/roster/${teamId}`}>
            <Button
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting || !teamId}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Player...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Add Player
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AddPlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AddPlayerForm />
    </Suspense>
  );
}
