export function DefaultNotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <p className="text-xl font-semibold text-destructive">404 Not Found</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>
      </div>
    </div>
  );
}
