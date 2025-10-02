import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/games">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Game Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find the game you&apos;re looking for. It may have been deleted or never existed.
        </p>
        <Link href="/games">
          <Button>View All Games</Button>
        </Link>
      </div>
    </div>
  );
}
