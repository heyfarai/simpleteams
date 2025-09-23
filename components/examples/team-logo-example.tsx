// Example usage of the team logo components

import { TeamLogo } from "@/components/team-logo";
import { TeamLogoUpload } from "@/components/team-logo-upload";

export function TeamLogoExample() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Team Logo Components</h2>

      {/* Display only (read-only) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Display Only</h3>
        <div className="flex gap-4 items-end">
          <TeamLogo teamName="Ottawa Thunder" size="xs" />
          <TeamLogo teamName="Ottawa Thunder" size="sm" />
          <TeamLogo teamName="Ottawa Thunder" size="md" />
          <TeamLogo teamName="Ottawa Thunder" size="lg" />
          <TeamLogo teamName="Ottawa Thunder" size="xl" />
        </div>
      </div>

      {/* Upload component (editable) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upload/Edit</h3>
        <TeamLogoUpload
          teamId="example-team-id"
          teamName="Ottawa Thunder"
          onLogoUpdated={(logoUrl) => {
            console.log("Logo updated:", logoUrl);
          }}
          size="lg"
        />
      </div>

      {/* Usage in a team card */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">In Team Card</h3>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <TeamLogo teamName="Ottawa Thunder" size="md" />
            <div>
              <h4 className="font-semibold">Ottawa Thunder</h4>
              <p className="text-sm text-gray-600">Premier Division</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}