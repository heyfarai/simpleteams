"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { useActiveDivisions } from "@/hooks/use-active-divisions";

interface DivisionStepProps {
  formData: {
    divisionPreference: string;
    registrationNotes: string;
  };
  onInputChange: (field: string, value: any) => void;
}

export function DivisionStep({ formData, onInputChange }: DivisionStepProps) {
  const { data: activeDivisions, isLoading: isDivisionsLoading } = useActiveDivisions();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Division Preference
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="divisionPreference">Preferred Division *</Label>
            <Select
              value={formData.divisionPreference}
              onValueChange={(value) => onInputChange("divisionPreference", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {isDivisionsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading divisions...
                  </SelectItem>
                ) : (
                  activeDivisions?.map((d) => (
                    <SelectItem key={d.division._id} value={d.division._id}>
                      {d.division.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {formData.divisionPreference && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  {activeDivisions?.map((d) => (
                    formData.divisionPreference === d.division._id && (
                      <div key={d.division._id}>
                        <h4 className="font-medium text-blue-900">
                          {d.division.name}
                        </h4>
                        <p className="mt-2 text-sm text-blue-600">
                          Teams in this division compete at a competitive level. Games are officiated by certified referees and follow FIBA rules.
                        </p>
                        <p className="mt-2 text-sm text-blue-600">
                          <span className="font-medium">Team Capacity:</span>{' '}
                          {d.teams?.length || 0} / {d.teamLimits?.max || 12} teams
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="registrationNotes">Additional Notes</Label>
            <Textarea
              id="registrationNotes"
              value={formData.registrationNotes}
              onChange={(e) => onInputChange("registrationNotes", e.target.value)}
              placeholder="Any additional information about your team or special requests..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
