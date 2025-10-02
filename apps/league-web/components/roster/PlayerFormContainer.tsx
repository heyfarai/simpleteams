import { Suspense } from "react";
import { PlayerFormHeader } from "./PlayerFormHeader";
import { PlayerFormFields } from "./PlayerFormFields";
import { PlayerFormActions } from "./PlayerFormActions";
import { usePlayerForm } from "@/hooks/use-player-form";

interface PlayerFormContainerProps {
  title: string;
  backPath: string;
  cancelPath: string;
  submitText: string;
  getDescription: (teamId?: string, seasonId?: string | null) => string;
  getTeamId: () => string | undefined;
  getSeasonId: () => string | null;
  redirectPath: string;
}

function PlayerFormContent({
  title,
  backPath,
  cancelPath,
  submitText,
  getDescription,
  getTeamId,
  getSeasonId,
  redirectPath,
}: PlayerFormContainerProps) {
  const teamId = getTeamId();
  const seasonId = getSeasonId();

  const {
    formData,
    photoPreview,
    isSubmitting,
    error,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
  } = usePlayerForm(redirectPath, teamId, seasonId);

  const description = getDescription(teamId, seasonId);

  return (
    <div className="p-6 max-w-4xl">
      <PlayerFormHeader
        title={title}
        backPath={backPath}
        description={description}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!teamId && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            Please select a team from the sidebar before adding a player.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <PlayerFormFields
          formData={formData}
          onInputChange={handleInputChange}
          photoPreview={photoPreview}
          onPhotoChange={handlePhotoChange}
          seasonId={seasonId}
        />

        <PlayerFormActions
          isSubmitting={isSubmitting}
          disabled={!teamId}
          cancelPath={cancelPath}
          submitText={submitText}
        />
      </form>
    </div>
  );
}

export function PlayerFormContainer(props: PlayerFormContainerProps) {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PlayerFormContent {...props} />
    </Suspense>
  );
}