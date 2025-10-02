import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GamesLoading() {
  return (
    <div className="grid gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
                  <div className="flex justify-between flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-16" />
                  </div>
                  <div className="hidden md:flex items-center px-4">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div className="flex justify-between flex-1">
                    <Skeleton className="h-10 w-16" />
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1 items-end">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex md:justify-center flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
