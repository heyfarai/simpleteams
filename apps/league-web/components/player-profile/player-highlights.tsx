import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Play, Target } from "lucide-react";
import { type PlayerProfile } from "@/lib/data/fetch-player-profile";

interface PlayerHighlightsProps {
  player: PlayerProfile;
}

export function PlayerHighlights({ player }: PlayerHighlightsProps) {
  return (
    <>
      {/* Highlight Videos */}
      {player.highlightVideos?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Highlight Reels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {player.highlightVideos.map((video, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg bg-muted/30 aspect-video mb-2">
                    <img
                      src={
                        video.thumbnail ||
                        "/placeholder.svg?height=200&width=300&query=basketball highlight video"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scouting Notes */}
      {player.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Scouting Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed italic">
              {player.bio}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
