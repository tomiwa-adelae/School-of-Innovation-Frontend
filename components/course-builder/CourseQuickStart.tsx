"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseTitleSchema, CourseTitleInput } from "@/lib/zodSchemas";
import { postData } from "@/lib/api";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconLoader2 } from "@tabler/icons-react";

/**
 * The only thing standing between an instructor and a saved draft.
 *
 * Everything else — media, category, outcomes, pricing — is filled in
 * afterwards against a course that already exists and autosaves, so closing
 * the tab can no longer throw the work away.
 */
export function CourseQuickStart({
  onCreated,
}: {
  onCreated: (courseId: string) => void;
}) {
  const form = useForm<CourseTitleInput>({
    resolver: zodResolver(CourseTitleSchema as any),
    defaultValues: { title: "" },
  });

  async function handleSubmit(data: CourseTitleInput) {
    try {
      const course = await postData<{ id: string }>("/courses", data);
      toast.success("Draft saved — everything from here saves automatically.");
      onCreated(course.id);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : (msg ?? "Could not create the course"),
      );
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold">
                  What is your course called?
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder="e.g. Build a Full-Stack App with Next.js"
                    className="h-12 text-base rounded-2xl"
                  />
                </FormControl>
                <FormDescription>
                  You can change this at any time. Everything else comes next.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-2xl"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <>
                Start building <IconArrowRight size={18} />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
