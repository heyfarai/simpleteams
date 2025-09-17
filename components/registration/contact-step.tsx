"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SelectedPackageDisplay } from "./selected-package-display";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Mail, Trophy } from "lucide-react";
import { useEffect } from "react";

interface ContactStepProps {
  formData: {
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
  };
  onInputChange: (field: string, value: any) => void;
  onGoToPrevious?: () => void;
}

export function ContactStep({ formData, onInputChange, onGoToPrevious }: ContactStepProps) {
  // Auto-fill mock data in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && (!formData.primaryContactName || !formData.headCoachName)) {
      onInputChange('primaryContactName', 'John Smith');
      onInputChange('primaryContactEmail', 'john.smith@thunderhawks.com');
      onInputChange('primaryContactPhone', '416-555-0123');
      onInputChange('primaryContactRole', 'manager');
      onInputChange('headCoachName', 'Sarah Johnson');
      onInputChange('headCoachEmail', 'coach.sarah@thunderhawks.com');
      onInputChange('headCoachPhone', '416-555-0124');
      onInputChange('headCoachCertifications', 'NCCP Level 2, First Aid CPR');
    }
  }, [formData.primaryContactName, formData.headCoachName, onInputChange]);

  return (
    <div className="space-y-6">
      {/* Selected Package Display */}
      {formData.selectedPackage && (
        <SelectedPackageDisplay
          selectedPackage={formData.selectedPackage}
          onChangePackage={onGoToPrevious}
          showChangeButton={false}
        />
      )}

      {/* Team Summary */}
      {(formData.teamName || formData.city || formData.contactEmail || formData.divisionPreference) && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Team Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {formData.teamName && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Team Name:</span>
                  <span className="text-gray-900">{formData.teamName}</span>
                </div>
              )}
              {(formData.city || formData.province) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="text-gray-900">{formData.city}{formData.province && `, ${formData.province}`}</span>
                </div>
              )}
              {formData.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-600">Contact:</span>
                  <span className="text-gray-900">{formData.contactEmail}</span>
                </div>
              )}
              {formData.divisionPreference && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-600">Division:</span>
                  <span className="text-gray-900">{formData.divisionPreference}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contact Information
        </h3>

        {/* Primary Contact */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Primary Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryContactName">Full Name *</Label>
              <Input
                id="primaryContactName"
                value={formData.primaryContactName}
                onChange={(e) =>
                  onInputChange("primaryContactName", e.target.value)
                }
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactEmail">Email Address *</Label>
              <Input
                id="primaryContactEmail"
                type="email"
                value={formData.primaryContactEmail}
                onChange={(e) =>
                  onInputChange("primaryContactEmail", e.target.value)
                }
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactPhone">Phone Number</Label>
              <Input
                id="primaryContactPhone"
                value={formData.primaryContactPhone}
                onChange={(e) =>
                  onInputChange("primaryContactPhone", e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactRole">Role</Label>
              <Select
                value={formData.primaryContactRole}
                onValueChange={(value) =>
                  onInputChange("primaryContactRole", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Team Manager</SelectItem>
                  <SelectItem value="parent">Parent Coordinator</SelectItem>
                  <SelectItem value="coordinator">Team Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Head Coach */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Head Coach</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headCoachName">Full Name *</Label>
              <Input
                id="headCoachName"
                value={formData.headCoachName}
                onChange={(e) =>
                  onInputChange("headCoachName", e.target.value)
                }
                placeholder="Enter coach name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headCoachEmail">Email Address *</Label>
              <Input
                id="headCoachEmail"
                type="email"
                value={formData.headCoachEmail}
                onChange={(e) =>
                  onInputChange("headCoachEmail", e.target.value)
                }
                placeholder="Enter coach email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headCoachPhone">Phone Number</Label>
              <Input
                id="headCoachPhone"
                value={formData.headCoachPhone}
                onChange={(e) =>
                  onInputChange("headCoachPhone", e.target.value)
                }
                placeholder="Enter coach phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headCoachCertifications">Certifications</Label>
              <Input
                id="headCoachCertifications"
                value={formData.headCoachCertifications}
                onChange={(e) =>
                  onInputChange("headCoachCertifications", e.target.value)
                }
                placeholder="e.g., Level 3 Certified, Youth Development"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
