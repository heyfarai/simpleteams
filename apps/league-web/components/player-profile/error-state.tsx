export function ErrorState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Player Not Found
        </h1>
        <p className="text-muted-foreground">
          The requested player profile could not be found.
        </p>
      </div>
    </div>
  );
}
