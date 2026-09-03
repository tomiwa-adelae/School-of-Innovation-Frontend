"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData, updateData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconRocket,
  IconLoader2,
  IconBook,
  IconVideo,
  IconClock,
  IconTag,
  IconCurrencyDollar,
  IconWorld,
  IconChartBar,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PublishChecklist,
  usePublishReadiness,
} from "./PublishChecklist";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CourseReviewProps {
  courseId: string;
  onBack: () => void;
}

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
};

const PRICING_LABELS: Record<string, string> = {
  FREE: "Free",
  PAID: "Paid",
  SUBSCRIPTION: "Subscription",
};

export function CourseReview({ courseId, onBack }: CourseReviewProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const { data: course, isLoading } = useQuery<any>({
    queryKey: ["course", courseId],
    queryFn: () => fetchData(`/courses/${courseId}`),
  });

  // Same source of truth as the rail checklist and the API, so the button
  // is never enabled for a submission the server would bounce.
  const { data: readiness } = usePublishReadiness(courseId);

  async function handlePublish() {
    setIsPublishing(true);
    try {
      await updateData(`/courses/${courseId}/publish`, {});
      toast.success(
        "Course submitted for review! Our team will approve it shortly.",
      );
      router.push("/dashboard/courses");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to submit course");
    } finally {
      setIsPublishing(false);
    }
  }

  function handleSaveDraft() {
    toast.success("Course saved as draft.");
    router.push("/dashboard/courses");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) return null;

  const totalLessons =
    course.chapters?.reduce((s: number, c: any) => s + c.lessons.length, 0) ??
    0;

  // Compute total duration from lesson data as a reliable fallback
  const totalDuration =
    course.duration ||
    (course.chapters?.reduce(
      (total: number, c: any) =>
        total +
        c.lessons.reduce((s: number, l: any) => s + (l.duration ?? 0), 0),
      0,
    ) ??
      0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-8 text-white">
        <div className="flex items-start gap-4">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-24 h-16 rounded-xl object-cover shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-blue-200 text-xs font-semibold uppercase mb-1">
              Review Your Course
            </p>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            {course.shortDescription && (
              <p className="text-blue-100 text-sm mt-2 leading-relaxed line-clamp-2">
                {course.shortDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          {
            icon: IconBook,
            label: "Chapters",
            value: course.chapters?.length ?? 0,
          },
          { icon: IconVideo, label: "Lessons", value: totalLessons },
          {
            icon: IconClock,
            label: "Duration",
            value: formatDuration(totalDuration),
          },
          {
            icon: IconChartBar,
            label: "Level",
            value: LEVEL_LABELS[course.level] ?? course.level,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-md p-4 border border-gray-100 dark:border-gray-800 text-center"
          >
            <Icon size={20} className="text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Course details */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconCurrencyDollar size={15} />
              <span>Pricing:</span>
              <span className="font-semibold text-foreground">
                {PRICING_LABELS[course.pricingType] ?? course.pricingType}
                {course.price > 0 && ` — $${course.price}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconWorld size={15} />
              <span>Language:</span>
              <span className="font-semibold text-foreground">
                {course.language}
              </span>
            </div>
            {course.category && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconTag size={15} />
                <span>Category:</span>
                <span className="font-semibold text-foreground">
                  {course.category.name}
                </span>
              </div>
            )}
          </div>

          {course.tags?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {course.learningOutcomes?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                What Students Will Learn
              </p>
              <ul className="space-y-1">
                {course.learningOutcomes.map((o: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Curriculum summary */}
      {course.chapters?.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Curriculum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {course.chapters.map((chapter: any, i: number) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-muted-foreground w-5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold">{chapter.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {chapter.lessons.length} lesson
                  {chapter.lessons.length !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Submission notice */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          📋 What happens after publishing?
        </p>
        <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
          Your course will be submitted for admin review. Once approved, it will
          be listed on the platform and students can enrol.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Curriculum
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          className="sm:ml-auto"
        >
          Save as Draft
        </Button>

        <Button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing || readiness?.canPublish === false}
        >
          {isPublishing ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            <>
              <IconRocket size={18} /> Submit for Review
            </>
          )}
        </Button>
      </div>

      {readiness && !readiness.canPublish && (
        <div className="pt-2">
          <p className="text-xs text-center text-muted-foreground mb-3">
            Finish these before submitting:
          </p>
          <PublishChecklist courseId={courseId} className="max-w-sm mx-auto" />
        </div>
      )}
    </div>
  );
}
