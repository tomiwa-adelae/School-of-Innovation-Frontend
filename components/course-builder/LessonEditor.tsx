"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonSchema, LessonInput } from "@/lib/zodSchemas";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { VideoUploader } from "./VideoUploader";
import { ImageUploader } from "./ImageUploader";
import { IconLoader2, IconClock } from "@tabler/icons-react";

interface Lesson {
  id: string;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  duration: number;
  isFree: boolean;
  isDownloadable: boolean;
  resources?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}

interface LessonEditorProps {
  open: boolean;
  lesson: Lesson | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<LessonInput>) => void;
  isSaving?: boolean;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LessonEditor({
  open,
  lesson,
  onClose,
  onSave,
  isSaving,
}: LessonEditorProps) {
  const form = useForm<LessonInput>({
    resolver: zodResolver(LessonSchema as any),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      duration: 0,
      isFree: false,
      isDownloadable: false,
    },
  });

  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        shortDescription: lesson.shortDescription ?? "",
        description: lesson.description ?? "",
        videoUrl: lesson.videoUrl ?? "",
        thumbnailUrl: lesson.thumbnailUrl ?? "",
        duration: lesson.duration,
        isFree: lesson.isFree,
        isDownloadable: lesson.isDownloadable,
      });
    }
  }, [lesson]);

  function handleSubmit(data: LessonInput) {
    if (!lesson) return;
    onSave(lesson.id, data);
  }

  const duration = form.watch("duration");

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="font-black text-xl">Edit Lesson</SheetTitle>
          <SheetDescription>
            Upload your video and fill in lesson details.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Video */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <VideoUploader
                      value={field.value}
                      onChange={field.onChange}
                      onDurationChange={(s) => form.setValue("duration", s)}
                      label="Lesson Video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration badge */}
            {duration > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 w-fit">
                <IconClock size={14} />
                Duration:{" "}
                <span className="font-semibold text-foreground">
                  {formatDuration(duration)}
                </span>
              </div>
            )}

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lesson Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. What is JavaScript?"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Short Description{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (SEO)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Brief description of this lesson..."
                      rows={2}
                      maxLength={200}
                      className="w-full px-3 py-3 rounded-xl border border-input bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lesson Thumbnail */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      folder="thumbnails"
                      label="Lesson Thumbnail (optional)"
                      aspectRatio="aspect-video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes / Transcript */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes / Transcript{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggles */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                    <div>
                      <FormLabel>Free Preview</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Allow non-enrolled students to watch this lesson
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDownloadable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                    <div>
                      <FormLabel>Downloadable</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Allow enrolled students to download the video
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-2xl font-black bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSaving ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  "Save Lesson"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
