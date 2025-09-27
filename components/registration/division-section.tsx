import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormData } from "@/hooks/use-registration-form";
import type { Division } from "@/lib/domain/models";

interface DivisionSectionProps {
  formData: FormData;
  divisions: Division[];
  divisionsLoading: boolean;
  divisionsError: any;
  onInputChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function DivisionSection({
  formData,
  divisions,
  divisionsLoading,
  divisionsError,
  onInputChange,
  disabled = false,
}: DivisionSectionProps) {
  return (
    <div>
      <h2 className="text-lg md:text-xl text-gray-900 mb-4">Division</h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        {divisionsLoading ? (
          <div className="text-gray-500">Loading divisions...</div>
        ) : divisionsError ? (
          <div className="text-red-500 bg-red-50 p-3 rounded-md">
            <p className="font-medium">Unable to load divisions</p>
            <p className="text-sm mt-1">
              Please refresh the page or try again later.
            </p>
          </div>
        ) : divisions.length === 0 ? (
          <div className="text-yellow-600 bg-yellow-50 p-3 rounded-md">
            <p className="font-medium">No divisions found</p>
            <p className="text-sm mt-1">
              No divisions are configured for the active season.
            </p>
          </div>
        ) : (
          <RadioGroup
            value={formData.divisionPreference}
            onValueChange={(value) =>
              onInputChange("divisionPreference", value)
            }
            className={`space-y-3 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
          >
            {divisions
              .filter((division) => division.isActive)
              .map((division) => (
                <div
                  key={division.id}
                  className="flex items-center space-x-3"
                >
                  <RadioGroupItem
                    value={division.id}
                    id={division.id}
                    className="bg-primary/10 shadow-none"
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={division.id}
                    className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
                  >
                    <div>
                      <div className="font-medium">{division.name}</div>
                      {division.description && (
                        <div className="text-sm text-gray-600">
                          {division.description}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
