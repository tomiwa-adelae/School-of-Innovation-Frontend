"use client";

import { useCallback, useRef, useState } from "react";
import { postData } from "@/lib/api";

export type BulkItemStatus = "queued" | "uploading" | "done" | "error";

export interface BulkUploadItem {
  id: string;
  file: File;
  /** Editable before commit — seeded from the filename. */
  title: string;
  status: BulkItemStatus;
  progress: number;
  /** Seconds, read from the file's metadata. */
  duration: number;
  url?: string;
  error?: string;
}

type Folder = "thumbnails" | "videos" | "resources" | "previews";

/** Uploads run this many at a time; more just starves each other's bandwidth. */
const CONCURRENCY = 3;

/** Turn "03 - Intro to Hooks.final.mp4" into "Intro to Hooks". */
export function titleFromFilename(name: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, "");
  return (
    withoutExt
      .replace(/[_-]+/g, " ")
      .replace(/\b(final|draft|v\d+|copy|export|render)\b/gi, "")
      .replace(/^\s*\d+[\s.)-]+/, "") // leading track numbers
      .replace(/\s{2,}/g, " ")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase()) || withoutExt
  );
}

function readDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    const done = (v: number) => {
      URL.revokeObjectURL(url);
      resolve(v);
    };
    video.onloadedmetadata = () =>
      done(Number.isFinite(video.duration) ? Math.round(video.duration) : 0);
    video.onerror = () => done(0);
    video.src = url;
  });
}

/**
 * Queue many files, upload them a few at a time, and report per-file progress.
 *
 * The single-file `usePresignedUpload` blocks the whole form on one transfer.
 * This lets an instructor drop a folder of videos and keep working while they
 * go up in the background.
 */
export function useBulkUpload(folder: Folder = "videos") {
  const [items, setItems] = useState<BulkUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const xhrs = useRef(new Map<string, XMLHttpRequest>());

  const patch = useCallback((id: string, changes: Partial<BulkUploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }, []);

  const uploadOne = useCallback(
    async (item: BulkUploadItem) => {
      patch(item.id, { status: "uploading", progress: 0 });

      try {
        const { presignedUrl, publicUrl } = await postData<{
          presignedUrl: string;
          publicUrl: string;
        }>("/upload/presigned-url", {
          filename: item.file.name,
          contentType: item.file.type,
          folder,
        });

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrs.current.set(item.id, xhr);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              patch(item.id, {
                progress: Math.round((e.loaded / e.total) * 100),
              });
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`Upload failed (${xhr.status})`));
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.onabort = () => reject(new Error("Upload cancelled"));

          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", item.file.type);
          xhr.send(item.file);
        });

        patch(item.id, { status: "done", progress: 100, url: publicUrl });
      } catch (err) {
        patch(item.id, {
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        });
      } finally {
        xhrs.current.delete(item.id);
      }
    },
    [folder, patch],
  );

  /** Add files to the queue and start uploading them. */
  const enqueue = useCallback(
    async (files: File[]) => {
      const videos = files.filter((f) => f.type.startsWith("video/"));
      if (videos.length === 0) return;

      const staged: BulkUploadItem[] = await Promise.all(
        videos.map(async (file) => ({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
          title: titleFromFilename(file.name),
          status: "queued" as const,
          progress: 0,
          duration: await readDuration(file),
        })),
      );

      setItems((prev) => [...prev, ...staged]);
      setIsUploading(true);

      // Simple worker pool: CONCURRENCY runners pulling off a shared cursor.
      let cursor = 0;
      const next = async (): Promise<void> => {
        const index = cursor++;
        if (index >= staged.length) return;
        await uploadOne(staged[index]);
        return next();
      };
      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, staged.length) }, next),
      );

      setIsUploading(false);
    },
    [uploadOne],
  );

  const retry = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      setIsUploading(true);
      await uploadOne(item);
      setIsUploading(false);
    },
    [items, uploadOne],
  );

  const rename = useCallback(
    (id: string, title: string) => patch(id, { title }),
    [patch],
  );

  const remove = useCallback((id: string) => {
    xhrs.current.get(id)?.abort();
    xhrs.current.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => {
    xhrs.current.forEach((xhr) => xhr.abort());
    xhrs.current.clear();
    setItems([]);
    setIsUploading(false);
  }, []);

  return {
    items,
    isUploading,
    enqueue,
    retry,
    rename,
    remove,
    clear,
    completed: items.filter((i) => i.status === "done"),
    failed: items.filter((i) => i.status === "error"),
  };
}
