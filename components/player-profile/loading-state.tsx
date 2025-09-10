export function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Loading Player Profile...
        </h1>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
