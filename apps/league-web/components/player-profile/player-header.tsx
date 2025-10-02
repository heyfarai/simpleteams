import { Card, CardContent } from "@/components/ui/card";
import { type PlayerProfile } from "@/lib/data/fetch-player-profile";

interface PlayerHeaderProps {
  player: PlayerProfile;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const team = player.team;

  return (
    <>
      <div className="mb-18 mt-48 text-center hidden">
        <h1 className="pageTitle mt-16 lg:mt-24 text-6xl font-bold text-foreground mb-2 text-center">
          {player.firstName} {player.lastName}
        </h1>
      </div>

      <div className="mb-8 mt-12 flex justify-center">
        <div className=" mb-6">
          {/* Player Image & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="/placeholder-player.svg"
                    alt={`${player.firstName} ${player.lastName} - ${
                      team?.name || "Player Photo"
                    }`}
                    className="w-full h-80 object-cover"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                      {player.firstName}
                    </h1>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      {player.lastName}
                    </h2>
                    <p className="text-lg font-semibold text-foreground">
                      {team?.name || "Unassigned"}
                    </p>
                    <p className="text-muted-foreground">
                      {player.personalInfo?.position || "N/A"}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary">
                        {player.stats?.points || "0"}
                      </div>
                      <div className="text-xs text-muted-foreground">PPG</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary">
                        {player.stats?.rebounds || "0"}
                      </div>
                      <div className="text-xs text-muted-foreground">RPG</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary">
                        {player.stats?.assists || "0"}
                      </div>
                      <div className="text-xs text-muted-foreground">APG</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
