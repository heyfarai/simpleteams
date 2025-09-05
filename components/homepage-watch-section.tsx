"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

export function HomepageWatchSection() {
  const popularHighlights = [
    {
      id: 1,
      title: "Championship Finals Highlights",
      thumbnail: "/basketball-championship-finals-game-thumbnail.jpg",
      duration: "8:45",
      date: "2025-01-15",
      teams: "Thunder Bolts vs Fire Hawks",
      views: 5200,
      type: "highlight",
    },
    {
      id: 2,
      title: "Season's Best Dunks",
      thumbnail: "/basketball-top-dunks-highlight-reel-thumbnail.jpg",
      duration: "6:30",
      date: "2025-01-20",
      teams: "All Teams",
      views: 4800,
      type: "highlight",
    },
    {
      id: 9,
      title: "Top 10 Plays This Week",
      thumbnail: "/basketball-clutch-game-winners-highlight-thumbnail.jpg",
      duration: "6:20",
      date: "2025-01-21",
      teams: "All Teams",
      views: 2800,
      type: "highlight",
    },
    {
      id: 4,
      title: "Marcus Thompson Career High",
      thumbnail: "/basketball-player-portrait-action-shot.png",
      duration: "4:20",
      date: "2025-01-18",
      teams: "Thunder Bolts",
      views: 3200,
      type: "highlight",
    },
  ]

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Watch</h2>
        <Link href="/watch">
          <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground bg-transparent">
            View All Videos
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularHighlights.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  )
}

interface VideoCardProps {
  video: {
    id: number
    title: string
    thumbnail: string
    duration: string
    date: string
    teams: string
    views: number
    type: string
  }
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div className="aspect-[9/16] relative">
            <img
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
              <Play className="h-4 w-4" />
            </Button>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
            {video.duration}
          </div>
        </div>

        <div className="p-3 space-y-1">
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{video.teams}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{video.views.toLocaleString()} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
