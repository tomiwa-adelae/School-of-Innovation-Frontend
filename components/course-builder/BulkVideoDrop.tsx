"use client";

import { useRef, useState } from "react";
import { postData } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useBulkUpload } from "@/hooks/useBulkUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconUpload,
  IconX,
  IconCheck,
  IconAlertTriangle,
  IconRefresh,
  IconLoader2,
} from "@tabler/icons-react";

interface Props {
  courseId: string;
  chapterId: string;
  chapterTitle?: string;
}

function formatDuration(seconds: number) {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Drop a folder of videos and get one lesson per file.
 *
 * The per-lesson flow (add lesson, open editor, fill fields, upload, save)
 * costs roughly eight interactions each. This costs one drop plus any titles
 * the instructor wants to correct, and uploads run in parallel in the
 * background while they keep working.
 */
export function BulkVideoDrop({ courseId, chapterId, chapterTitle }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const [dragOver, setDragOver] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

  const { items, isUploading, enqueue, retry, rename, remove, clear, completed, failed } =
    useBulkUpload("videos");

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    void enqueue(Array.from(e.dataTransfer.files));
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    void enqueue(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  async function handleCommit() {
    if (completed.length === 0) return;
    setIsCommitting(true);
    try {
      await postData(`/chapters/${chapterId}/lessons/bulk`, {
        lessons: completed.map((item) => ({
          title: item.title.trim() || "Untitled lesson",
          videoUrl: item.url,
          duration: item.duration,
        })),
      });
      qc.invalidateQueries({ queryKey: ["course", courseId] });
      qc.invalidateQueries({ queryKey: ["course-readiness", courseId] });
      toast.success(
        `Added ${completed.length} lesson${completed.length === 1 ? "" : "s"}`,
      );
      clear();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : (msg ?? "Could not add the lessons"),
      );
    } finally {
      setIsCommitting(false);
    }
  }

  const busy = isUploading || isCommitting;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "w-full rounded-2xl border-2 border-dashed py-8 px-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer",
          dragOver
            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
            : "border-gray-200 dark:border-gray-700 hover:border-purple-400 bg-gray-50/60 dark:bg-gray-900/40",
        )}
      >
        <div className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
          <IconUpload size={20} className="text-purple-600" />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Drop your videos here — one lesson per file
        </p>
        <p className="text-xs text-muted-foreground">
          Select as many as you like. Titles come from the filenames and stay
          editable{chapterTitle ? ` · adding to "${chapterTitle}"` : ""}
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handlePick}
      />

      {items.length > 0 && (
        <div className="rounded-2xl border divide-y overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="p-3 flex items-center gap-3">
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center">
                {item.status === "done" && (
                  <IconCheck size={16} className="text-green-600" />
                )}
                {item.status === "error" && (
                  <IconAlertTriangle size={16} className="text-red-600" />
                )}
                {(item.status === "uploading" || item.status === "queued") && (
                  <IconLoader2
                    size={16}
                    className="animate-spin text-purple-500"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <Input
                  value={item.title}
                  onChange={(e) => rename(item.id, e.target.value)}
                  className="h-8 text-sm"
                  aria-label="Lesson title"
                />
                {item.status === "error" ? (
                  <p className="text-xs text-red-600">{item.error}</p>
                ) : item.status === "done" ? (
                  <p className="text-xs text-muted-foreground">
                    Uploaded · {formatDuration(item.duration)}
                  </p>
                ) : (
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-1">
                {item.status === "error" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void retry(item.id)}
                    aria-label="Retry upload"
                  >
                    <IconRefresh size={15} />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(item.id)}
                  aria-label="Remove"
                >
                  <IconX size={15} />
                </Button>
              </div>
            </div>
          ))}

          <div className="p-3 flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-muted-foreground">
              {completed.length} of {items.length} uploaded
              {failed.length > 0 && ` · ${failed.length} failed`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clear}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCommit}
                disabled={busy || completed.length === 0}
              >
                {isCommitting ? (
                  <IconLoader2 size={15} className="animate-spin" />
                ) : (
                  `Add ${completed.length || ""} lesson${completed.length === 1 ? "" : "s"}`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
