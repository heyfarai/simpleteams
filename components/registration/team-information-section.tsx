import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import type { FormData } from "@/hooks/use-registration-form";

interface TeamInformationSectionProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  onChangeEmail: () => void;
  onShowSignIn: () => void;
}

export function TeamInformationSection({
  formData,
  onInputChange,
  onChangeEmail,
  onShowSignIn,
}: TeamInformationSectionProps) {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-lg md:text-xl text-gray-900 mb-4">
        Team Information
      </h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center">
              {/* TODO: Separate email without creating friction */}
              <Label htmlFor="contactEmail">
                Contact Email *
                {user && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (using your account email)
                  </span>
                )}
              </Label>
              {!user ? (
                <button
                  type="button"
                  onClick={onShowSignIn}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  Sign in
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onChangeEmail}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  Change email
                </button>
              )}
            </div>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => onInputChange("contactEmail", e.target.value)}
              className={`mt-1 bg-primary/10 shadow-none ${
                user ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              readOnly={!!user}
              disabled={!!user}
              required
            />
          </div>
          <div>
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => onInputChange("teamName", e.target.value)}
              className="mt-1 bg-primary/10 shadow-none"
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              className="mt-1 bg-primary/10 shadow-none"
              required
            />
          </div>
          <div className="hidden sm:col-span-2">
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => onInputChange("province", e.target.value)}
              className="mt-1 bg-primary/10 shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
