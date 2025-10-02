import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Instagram, Twitter, ExternalLink } from "lucide-react";
import Link from "next/link";
import { type PlayerProfile } from "@/lib/data/fetch-player-profile";

interface PlayerSidebarProps {
  player: PlayerProfile;
}

export function PlayerSidebar({ player }: PlayerSidebarProps) {
  const team = player.team;

  return (
    <div className="space-y-6">
      {/* Contact & Social */}
      <Card>
        <CardHeader>
          <CardTitle>Connect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {player.social?.instagram && (
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              asChild
            >
              <a
                href={`https://instagram.com/${player.social.instagram.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4 mr-2" />
                {player.social.instagram}
              </a>
            </Button>
          )}

          {player.social?.twitter && (
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              asChild
            >
              <a
                href={`https://twitter.com/${player.social.twitter.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4 mr-2" />
                {player.social.twitter}
              </a>
            </Button>
          )}

          {player.social?.hudl && (
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              asChild
            >
              <a
                href={player.social.hudl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Hudl Profile
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Team Info */}
      {team && (
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/placeholder-team.png"
                alt={`${team?.name || "Team"} logo`}
                className="w-12 h-12 rounded-full object-cover bg-muted"
              />
              <div>
                <div className="font-medium text-foreground">{team?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {team?.division}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              {team?.coach && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coach:</span>
                  <span className="font-medium">{team?.coach}</span>
                </div>
              )}
              {team?.record && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Record:</span>
                  <span className="font-medium">{team?.record}</span>
                </div>
              )}
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 mt-4"
              asChild
            >
              <Link href={`/teams/${team?._id}`}>View Team Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Share Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Share Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Share this player profile for recruiting and scouting purposes.
          </p>
          <Button
            variant="outline"
            className="w-full bg-transparent"
          >
            Copy Profile Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
