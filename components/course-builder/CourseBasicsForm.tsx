"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CourseBasicsSchema, CourseBasicsInput } from "@/lib/zodSchemas";
import { fetchData } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";
import { ArrayInput } from "./ArrayInput";
import { PricingSection } from "./PricingSection";
import { IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface CourseBasicsFormProps {
  initialData?: Partial<CourseBasicsInput>;
  onSubmit: (data: CourseBasicsInput) => Promise<void>;
  isLoading?: boolean;
}

const LEVEL_OPTIONS = [
  { value: "ALL_LEVELS", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const LANGUAGE_OPTIONS = [
  "English", "French", "Arabic", "Swahili", "Yoruba", "Hausa", "Igbo",
  "Amharic", "Portuguese", "Spanish",
];

export function CourseBasicsForm({
  initialData,
  onSubmit,
  isLoading,
}: CourseBasicsFormProps) {
  const form = useForm<CourseBasicsInput>({
    resolver: zodResolver(CourseBasicsSchema as any),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      level: "ALL_LEVELS",
      language: "English",
      pricingType: "FREE",
      currency: "USD",
      thumbnail: "",
      previewVideo: "",
      tags: [],
      learningOutcomes: [""],
      requirements: [],
      targetAudience: [],
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) form.reset({ ...form.getValues(), ...initialData });
  }, [initialData]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchData("/categories"),
  });

  const charCount = (form.watch("shortDescription") ?? "").length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

        {/* ── Section 1: Core Info ── */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Course Info</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Course Title <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Complete Web Development Bootcamp 2025"
                    className="rounded-xl py-5 text-base"
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
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold">Short Description <span className="text-xs text-muted-foreground font-normal">(SEO)</span></FormLabel>
                  <span className={cn("text-xs", charCount > 180 ? "text-amber-500" : "text-muted-foreground")}>
                    {charCount}/200
                  </span>
                </div>
                <FormControl>
                  <textarea
                    placeholder="A concise summary that appears in search results and course cards..."
                    rows={3}
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
                <FormLabel className="font-bold">Full Description</FormLabel>
                <FormControl>
                  <RichTextEditor field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* ── Section 2: Media ── */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Course Media</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      folder="thumbnails"
                      label="Course Thumbnail"
                      aspectRatio="aspect-video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previewVideo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <VideoUploader
                      value={field.value}
                      onChange={field.onChange}
                      label="Preview / Intro Video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ── Section 3: Details ── */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Course Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Category</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Level</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEVEL_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Language</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ArrayInput
            name="tags"
            control={form.control}
            label="Tags"
            placeholder="e.g. React, TypeScript, Web Dev"
            description="Help students discover your course"
          />
        </section>

        {/* ── Section 4: Learning Goals ── */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Learning Goals</h2>

          <ArrayInput
            name="learningOutcomes"
            control={form.control}
            label="What students will learn"
            placeholder="e.g. Build full-stack web apps with React and Node.js"
            description="At least 1 outcome required — shown on the course landing page"
          />

          <ArrayInput
            name="requirements"
            control={form.control}
            label="Requirements"
            placeholder="e.g. Basic knowledge of HTML and CSS"
            description="What students need before taking this course"
          />

          <ArrayInput
            name="targetAudience"
            control={form.control}
            label="Who this course is for"
            placeholder="e.g. Beginner web developers"
          />
        </section>

        {/* ── Section 5: Pricing ── */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Pricing</h2>
          <PricingSection control={form.control} />
        </section>

        {/* ── Submit ── */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black gap-2"
          >
            {isLoading ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <>Save & Continue <IconArrowRight size={18} /></>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
