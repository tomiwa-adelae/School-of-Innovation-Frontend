"use client";

import { useRef } from "react";
import {
  IconPaperclip,
  IconTrash,
  IconLoader2,
  IconFile,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { postData } from "@/lib/api";
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

interface ResourceUploaderProps {
  lessonId: string;
  resources: Resource[];
  onRefresh: () => void;
}

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResourceUploader({
  lessonId,
  resources,
  onRefresh,
}: ResourceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = usePresignedUpload();

  async function handleFile(file: File) {
    try {
      const url = await upload(file, "resources");
      const ext = file.name.split(".").pop() ?? "file";
      await postData(`/lessons/${lessonId}/resources`, {
        name: file.name,
        url,
        type: ext,
        size: file.size,
      });
      onRefresh();
      toast.success("Resource uploaded");
    } catch {
      toast.error("Failed to upload resource");
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) await handleFile(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          Downloadable Resources
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="gap-2 rounded-xl text-xs"
        >
          {isUploading ? (
            <IconLoader2 size={14} className="animate-spin" />
          ) : (
            <IconPaperclip size={14} />
          )}
          Attach File
        </Button>
      </div>

      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/40 rounded-md flex items-center justify-center shrink-0">
                <IconFile size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.type.toUpperCase()} {formatBytes(r.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  /* TODO: delete resource endpoint */
                }}
              >
                <IconTrash size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
