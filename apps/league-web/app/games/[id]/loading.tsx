import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
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
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-2/3 mb-6" />

        {/* Game Details */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Score and Teams */}
            <div>
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-10 w-16" />
                </div>
                <Skeleton className="h-6 w-8" />
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div>
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
