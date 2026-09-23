import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="typeset flex h-full flex-col items-center justify-center gap-y-3">
      <h1>Welcome home!</h1>
      <Button
        onClick={() =>
          toast.add({
            type: "success",
            description: "Toast!",
          })
        }
      >
        Toast!
      </Button>
    </div>
  );
}
