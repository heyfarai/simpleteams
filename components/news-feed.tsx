import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export function NewsFeed() {
  // Mock news data
  const newsItems = [
    {
      id: 1,
      title: "Season Playoffs Begin Next Week",
      excerpt: "The highly anticipated playoff season kicks off next Monday with four exciting matchups",
      author: "League Staff",
      date: "January 20, 2025",
      thumbnail: "/basketball-playoff-tournament-bracket.jpg",
    },
    {
      id: 2,
      title: "New Partnership with Springfield Sports Store",
      excerpt: "New partnership brings equipment discounts to all league participants",
      author: "Admin Team",
      date: "January 18, 2025",
      thumbnail: "/basketball-equipment-store-partnership.jpg",
    },
    {
      id: 3,
      title: "Player Spotlight: Marcus Thompson",
      excerpt: "Featured player leading Thunder Bolts to an impressive season record",
      author: "Sarah Johnson",
      date: "January 15, 2025",
      thumbnail: "/basketball-player-marcus-thompson-action-shot.jpg",
    },
  ]

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Latest News</h2>
          <p className="text-muted-foreground">Stay updated with league happenings</p>
        </div>
        <Button variant="outline" className="hidden sm:flex bg-transparent">
          View All News
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.author}</span>
                </div>

                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>

                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                  Read More
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center sm:hidden">
        <Button variant="outline" className="w-full bg-transparent">
          View All News
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </section>
  )
}
