"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconLoader2,
} from "@tabler/icons-react";

export interface ReadinessCheck {
  key: string;
  label: string;
  done: boolean;
  required: boolean;
}

export interface Readiness {
  status: string;
  checks: ReadinessCheck[];
  canPublish: boolean;
  lessonCount: number;
  lessonsMissingVideo: number;
}

/** Shared query key so any mutation can invalidate the checklist. */
export const readinessKey = (courseId: string) => ["course-readiness", courseId];

export function usePublishReadiness(courseId: string | null) {
  return useQuery<Readiness>({
    queryKey: readinessKey(courseId ?? ""),
    queryFn: () => fetchData(`/courses/${courseId}/readiness`),
    enabled: !!courseId,
  });
}

/**
 * Live "ready to publish" panel.
 *
 * Reads the same rules the API enforces (GET /courses/:id/readiness), so the
 * UI can never invite someone to submit a course the server will reject.
 */
export function PublishChecklist({
  courseId,
  className,
}: {
  courseId: string;
  className?: string;
}) {
  const { data, isLoading } = usePublishReadiness(courseId);

  if (isLoading || !data) {
    return (
      <div
        className={cn(
          "rounded-3xl border p-5 flex items-center gap-2 text-sm text-muted-foreground",
          className,
        )}
      >
        <IconLoader2 size={16} className="animate-spin" />
        Checking what is left to do…
      </div>
    );
  }

  const required = data.checks.filter((c) => c.required);
  const optional = data.checks.filter((c) => !c.required);
  const doneCount = required.filter((c) => c.done).length;
  const pct = Math.round((doneCount / Math.max(1, required.length)) * 100);

  return (
    <div className={cn("rounded-3xl border p-5 space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold text-sm">Ready to publish</h3>
          <span
            className={cn(
              "text-xs font-semibold",
              data.canPublish ? "text-green-600" : "text-muted-foreground",
            )}
          >
            {doneCount}/{required.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              data.canPublish ? "bg-green-500" : "bg-blue-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {required.map((check) => (
          <ChecklistRow key={check.key} check={check} />
        ))}
      </ul>

      {optional.length > 0 && (
        <div className="pt-3 border-t space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recommended
          </p>
          <ul className="space-y-2">
            {optional.map((check) => (
              <ChecklistRow key={check.key} check={check} />
            ))}
          </ul>
        </div>
      )}

      {data.lessonsMissingVideo > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-500">
          {data.lessonsMissingVideo} lesson
          {data.lessonsMissingVideo === 1 ? "" : "s"} still need a video.
        </p>
      )}
    </div>
  );
}

function ChecklistRow({ check }: { check: ReadinessCheck }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {check.done ? (
        <IconCircleCheckFilled size={16} className="text-green-600 shrink-0" />
      ) : (
        <IconCircleDashed size={16} className="text-gray-400 shrink-0" />
      )}
      <span
        className={cn(
          check.done ? "text-muted-foreground line-through" : "text-foreground",
        )}
      >
        {check.label}
      </span>
    </li>
  );
}
