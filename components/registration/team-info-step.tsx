"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Palette } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/sanity/client";
import { useEffect } from "react";
import { toast } from "sonner";

interface Division {
  _id: string;
  name: string;
  ageGroup: string;
}

const fetchDivisions = async () => {
  const query = `*[_type == "season" && _id == $seasonId][0]{
    "divisions": activeDivisions[].division->{
      _id,
      name,
      ageGroup
    }
  }`;

  const result = await client.fetch(query, {
    seasonId: process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID,
  });

  return result?.divisions || [];
};

interface TeamInfoStepProps {
  formData: {
    selectedPackage: string;
    teamName: string;
    city: string;
    province: string;
    contactEmail: string;
    primaryColors: string[];
    divisionPreference: string;
    registrationNotes: string;
  };
  logoPreview: string | null;
  onInputChange: (field: string, value: any) => void;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onGoToPrevious?: () => void;
}

export function TeamInfoStep({
  formData,
  logoPreview,
  onInputChange,
  onLogoUpload,
  onColorChange,
  onAddColor,
  onRemoveColor,
  onGoToPrevious,
}: TeamInfoStepProps) {
  const { data: divisions = [], isLoading, error } = useQuery<Division[]>({
    queryKey: ["divisions"],
    queryFn: fetchDivisions,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      if (error.message.includes('fetch failed')) {
        toast.error('Sanity CMS Unavailable', {
          description: 'Unable to load divisions. Please refresh the page or try again later.',
          duration: 8000,
          action: {
            label: 'Refresh',
            onClick: () => window.location.reload()
          }
        });
      }
    }
  });

  // Auto-fill mock data in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && (!formData.teamName || !formData.city)) {
      onInputChange('teamName', 'Thunder Hawks');
      onInputChange('city', 'Toronto');
      onInputChange('province', 'Ontario');
      onInputChange('contactEmail', 'team@thunderhawks.com');
    }
  }, [formData.teamName, formData.city, onInputChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Team Information
        </h2>
        <p className="text-gray-600">
          Tell us about your team and we'll save your progress
        </p>
      </div>

      {/* Contact Email Section - First */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Contact Email</h4>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => onInputChange("contactEmail", e.target.value)}
            placeholder="Enter contact email for updates"
            required
          />
          <p className="text-xs text-gray-500">
            We'll use this to save your progress and send updates about your registration
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Team Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => onInputChange("teamName", e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              placeholder="Enter city"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="province">Province *</Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => onInputChange("province", e.target.value)}
              placeholder="Enter province"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Division</h4>
        {isLoading ? (
          <div className="text-gray-500">Loading divisions...</div>
        ) : error ? (
          <div className="text-red-500 bg-red-50 p-3 rounded-md">
            <p className="font-medium">Unable to load divisions</p>
            <p className="text-sm mt-1">
              {error.message.includes('fetch failed') ?
                'Service temporarily unavailable. Please refresh the page or try again later.' :
                `Error: ${error.message}`
              }
            </p>
          </div>
        ) : divisions.length === 0 ? (
          <div className="text-yellow-600 bg-yellow-50 p-3 rounded-md">
            <p className="font-medium">No divisions found</p>
            <p className="text-sm mt-1">No divisions are configured for the active season.</p>
          </div>
        ) : (
          <RadioGroup
            value={formData.divisionPreference}
            onValueChange={(value: string) =>
              onInputChange("divisionPreference", value)
            }
            className="space-y-3"
          >
            {divisions.map((division) => (
              <div
                key={division._id}
                className="flex items-center space-x-3"
              >
                <RadioGroupItem
                  value={division._id}
                  id={division._id}
                  className="w-4 h-4 border-2 border-gray-300 rounded-full data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label
                  htmlFor={division._id}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {division.name} - {division.ageGroup}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      <Separator />

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Additional Information
        </h4>
        <div className="space-y-2">
          <Label htmlFor="registrationNotes">Registration Notes</Label>
          <Textarea
            id="registrationNotes"
            value={formData.registrationNotes}
            onChange={(e) => onInputChange("registrationNotes", e.target.value)}
            placeholder="Any special requests or information we should know about your team?"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Optional: Share any special requirements, questions, or information about your team
          </p>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Team Branding
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">Team Logo</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={logoPreview || "/placeholder.svg"}
                  alt="Team logo"
                />
                <AvatarFallback>
                  {formData.teamName.substring(0, 2) || "TM"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={onLogoUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="logo"
                  className="cursor-pointer"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Primary Colors */}
          <div className="space-y-2">
            <Label>Primary Colors</Label>
            <div className="space-y-3">
              {formData.primaryColors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => onColorChange(index, e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => onColorChange(index, e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  {formData.primaryColors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveColor(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formData.primaryColors.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddColor}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Add Color
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
