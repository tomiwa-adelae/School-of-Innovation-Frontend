"use client";

import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/hooks/useAutosave";
import {
  IconCheck,
  IconCloudUpload,
  IconAlertTriangle,
} from "@tabler/icons-react";

/** Quiet, always-visible confirmation that nothing is being lost. */
export function SaveIndicator({
  status,
  lastSavedAt,
  className,
}: {
  status: SaveStatus;
  lastSavedAt?: Date | null;
  className?: string;
}) {
  const base = "flex items-center gap-1.5 text-xs font-medium";

  if (status === "saving") {
    return (
      <span className={cn(base, "text-muted-foreground", className)}>
        <IconCloudUpload size={14} className="animate-pulse" />
        Saving…
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className={cn(base, "text-red-600", className)}>
        <IconAlertTriangle size={14} />
        Could not save — retrying
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span className={cn(base, "text-green-600", className)}>
        <IconCheck size={14} />
        Saved
        {lastSavedAt
          ? ` ${lastSavedAt.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}`
          : ""}
      </span>
    );
  }

  return (
    <span className={cn(base, "text-muted-foreground", className)}>
      All changes save automatically
    </span>
  );
}
