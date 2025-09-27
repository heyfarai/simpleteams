import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormData } from "@/hooks/use-registration-form";

interface ContactInformationSectionProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export function ContactInformationSection({
  formData,
  onInputChange,
}: ContactInformationSectionProps) {
  return (
    <div>
      <h2 className="text-lg md:text-xl text-gray-900 mb-4">
        Contact Information
      </h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border space-y-4 md:space-y-6">
        {/* Primary Contact */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Primary Contact
          </h3>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <Label htmlFor="primaryContactName">Full Name *</Label>
              <Input
                id="primaryContactName"
                value={formData.primaryContactName}
                onChange={(e) =>
                  onInputChange("primaryContactName", e.target.value)
                }
                className="mt-1 bg-primary/10 shadow-none"
                required
              />
            </div>
            <div>
              <Label htmlFor="primaryContactPhone">Phone Number</Label>
              <Input
                id="primaryContactPhone"
                value={formData.primaryContactPhone}
                onChange={(e) =>
                  onInputChange("primaryContactPhone", e.target.value)
                }
                className="mt-1 bg-primary/10 shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="primaryContactRole">Role</Label>
              <Select
                value={formData.primaryContactRole}
                onValueChange={(value) =>
                  onInputChange("primaryContactRole", value)
                }
              >
                <SelectTrigger className="mt-1 bg-primary/10 shadow-none w-full">
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

        {/* Head Coach */}
        <div className="hidden">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Head Coach{" "}
            <span className="text-sm font-normal text-gray-500">
              (optional)
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <Label htmlFor="headCoachName">Full Name</Label>
              <Input
                id="headCoachName"
                value={formData.headCoachName}
                onChange={(e) => onInputChange("headCoachName", e.target.value)}
                className="mt-1 bg-primary/10 shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="headCoachEmail">Email Address</Label>
              <Input
                id="headCoachEmail"
                type="email"
                value={formData.headCoachEmail}
                onChange={(e) =>
                  onInputChange("headCoachEmail", e.target.value)
                }
                className="mt-1 bg-primary/10 shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="headCoachPhone">Phone Number</Label>
              <Input
                id="headCoachPhone"
                value={formData.headCoachPhone}
                onChange={(e) =>
                  onInputChange("headCoachPhone", e.target.value)
                }
                className="mt-1 bg-primary/10 shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="headCoachCertifications">Certifications</Label>
              <Input
                id="headCoachCertifications"
                value={formData.headCoachCertifications}
                onChange={(e) =>
                  onInputChange("headCoachCertifications", e.target.value)
                }
                placeholder="e.g., Level 3 Certified, Youth Development"
                className="mt-1 bg-primary/10 shadow-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
