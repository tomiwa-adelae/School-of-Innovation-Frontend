"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconVideo,
  IconX,
  IconLoader2,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";

interface VideoUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onDurationChange?: (seconds: number) => void;
  label?: string;
}

function extractDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(video.duration));
    };
    video.onerror = () => resolve(0);
    video.src = url;
  });
}

export function VideoUploader({
  value,
  onChange,
  onDurationChange,
  label = "Upload Video",
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress } = usePresignedUpload();
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("video/")) return;

    if (onDurationChange) {
      const duration = await extractDuration(file);
      onDurationChange(duration);
    }

    const url = await upload(file, "videos");
    onChange(url);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
    e.target.value = "";
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</p>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
          <video
            src={value}
            controls
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <IconX size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={isUploading}
          className={cn(
            "w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
            dragOver
              ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-purple-400"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 w-48">
              <IconLoader2 size={28} className="animate-spin text-purple-500" />
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-purple-600">
                Uploading {progress}%
              </p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <IconVideo size={28} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Click or drag video here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, MOV, WEBM — up to 2GB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
