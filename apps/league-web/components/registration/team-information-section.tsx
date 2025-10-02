import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "@/hooks/use-registration-form";

interface TeamInformationSectionProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function TeamInformationSection({
  formData,
  onInputChange,
  disabled = false,
}: TeamInformationSectionProps) {

  return (
    <div>
      <h2 className="text-lg md:text-xl text-gray-900 mb-4">
        Team Information
      </h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => onInputChange("teamName", e.target.value)}
              className={`mt-1 bg-primary/10 shadow-none ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={disabled}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              className={`mt-1 bg-primary/10 shadow-none ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={disabled}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => onInputChange("province", e.target.value)}
              className={`mt-1 bg-primary/10 shadow-none ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
