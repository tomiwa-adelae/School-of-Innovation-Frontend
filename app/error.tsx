"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-red-500 mb-4">500</p>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground text-sm mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
