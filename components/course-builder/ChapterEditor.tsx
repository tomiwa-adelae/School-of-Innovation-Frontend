"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChapterSchema, ChapterInput } from "@/lib/zodSchemas";
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
import { IconLoader2 } from "@tabler/icons-react";

interface Chapter {
  id: string;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  isFree: boolean;
}

interface ChapterEditorProps {
  open: boolean;
  chapter: Chapter | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<ChapterInput>) => void;
  isSaving?: boolean;
}

export function ChapterEditor({
  open,
  chapter,
  onClose,
  onSave,
  isSaving,
}: ChapterEditorProps) {
  const form = useForm<ChapterInput>({
    resolver: zodResolver(ChapterSchema as any),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      isFree: false,
    },
  });

  useEffect(() => {
    if (chapter) {
      form.reset({
        title: chapter.title,
        shortDescription: chapter.shortDescription ?? "",
        description: chapter.description ?? "",
        isFree: chapter.isFree,
      });
    }
  }, [chapter]);

  function handleSubmit(data: ChapterInput) {
    if (!chapter) return;
    onSave(chapter.id, data);
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="font-black text-xl">Edit Chapter</SheetTitle>
          <SheetDescription>
            Update the chapter details. Changes are saved when you click Save.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Chapter Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Introduction to JavaScript"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Short Description{" "}
                    <span className="text-xs text-muted-foreground font-normal">(SEO)</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Brief overview of what this chapter covers..."
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Chapter Overview{" "}
                    <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                  <div>
                    <FormLabel className="font-bold">Free Preview</FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Allow non-enrolled students to preview this chapter
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
                className="flex-1 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  "Save Chapter"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
