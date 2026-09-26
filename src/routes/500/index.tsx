import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/500/")({
  component: InternalServerErrorPage,
});

function InternalServerErrorPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-3">
      <h1 className="text-2xl text-destructive">500 - Internal server error</h1>
      <p>Something went wrong. Please try again or contact support.</p>
    </div>
  );
}
