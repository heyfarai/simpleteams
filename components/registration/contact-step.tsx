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

interface ContactStepProps {
  formData: {
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
}

export function ContactStep({ formData, onInputChange }: ContactStepProps) {
  return (
    <div className="space-y-6">
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
