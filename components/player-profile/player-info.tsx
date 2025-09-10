import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Award, Trophy } from "lucide-react";
import { type PlayerProfile } from "@/lib/data/fetch-player-profile";

interface PlayerInfoProps {
  player: PlayerProfile;
}

export function PlayerInfo({ player }: PlayerInfoProps) {
  const team = player.team;

  return (
    <>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Player Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class:</span>
                <span className="font-medium">{player.personalInfo?.gradYear || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height:</span>
                <span className="font-medium">{player.personalInfo?.height || 'N/A'}</span>
              </div>
              {player.personalInfo?.weight && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{player.personalInfo?.weight}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-medium">{player.personalInfo?.position || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Division:</span>
                <span className="font-medium">
                  {team?.division || 'N/A'}
                </span>
              </div>
              {player.personalInfo?.hometown && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hometown:</span>
                  <span className="font-medium">{player.personalInfo?.hometown}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Games Played:
                </span>
                <span className="font-medium">
                  {player.stats?.gamesPlayed || '0'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Bio */}
      {player.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About {player.firstName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{player.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Awards & Achievements */}
      {player.awards?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Awards & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {player.awards.map((award, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-2 px-4"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  {award}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
