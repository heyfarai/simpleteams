"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    divisionPreference: string;
  };
  onInputChange: (field: string, value: any) => void;
  onGoToPrevious?: () => void;
}

export function TeamInfoStep({
  formData,
  onInputChange,
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

    </div>
  );
}
