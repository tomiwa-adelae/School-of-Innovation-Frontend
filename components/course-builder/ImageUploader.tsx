"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconPhoto, IconUpload, IconX, IconLoader2 } from "@tabler/icons-react";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: "thumbnails" | "previews";
  label?: string;
  aspectRatio?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "thumbnails",
  label = "Upload Image",
  aspectRatio = "aspect-video",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress } = usePresignedUpload();
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = await upload(file, folder);
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
        <div className={cn("relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800", aspectRatio)}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <IconX size={14} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <IconUpload size={12} /> Change
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
            "w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
            aspectRatio,
            dragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <IconLoader2 size={28} className="animate-spin text-blue-500" />
              <p className="text-sm font-semibold text-blue-600">{progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <IconPhoto size={24} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Click or drag image here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
