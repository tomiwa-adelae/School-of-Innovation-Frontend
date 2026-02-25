"use client";

import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconBook,
  IconCheck,
  IconX,
  IconLoader2,
  IconClock,
  IconUser,
  IconFilter,
  IconChartBar,
  IconCurrencyDollar,
  IconExternalLink,
} from "@tabler/icons-react";

type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";
type Filter = "ALL" | CourseStatus;

interface Course {
  id: string;
  title: string;
  shortDescription: string | null;
  thumbnail: string | null;
  status: CourseStatus;
  pricingType: string;
  price: number | null;
  level: string;
  language: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string } | null;
  instructor: { id: string; firstName: string; lastName: string; email: string };
  _count: { chapters: number };
}

const STATUS_CONFIG: Record<CourseStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  },
};

const LEVEL_LABELS: Record<string, string> = {
  ALL_LEVELS: "All Levels",
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "ALL" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function AdminCoursesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("UNDER_REVIEW");
  const [confirmAction, setConfirmAction] = useState<{
    courseId: string;
    type: "approve" | "reject";
    courseTitle: string;
  } | null>(null);

  if (!user) return null;
  if (user.role !== "ADMINISTRATOR") {
    router.replace("/a/dashboard");
    return null;
  }

  const queryKey = ["admin-courses", filter];

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey,
    queryFn: () =>
      fetchData(
        filter === "ALL" ? "/admin/courses" : `/admin/courses?status=${filter}`
      ),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => updateData(`/admin/courses/${id}/approve`, {}),
    onSuccess: () => {
      toast.success("Course approved and published!");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: () => toast.error("Failed to approve course"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => updateData(`/admin/courses/${id}/reject`, {}),
    onSuccess: () => {
      toast.success("Course rejected and moved back to draft");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: () => toast.error("Failed to reject course"),
  });

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMutation.mutate(confirmAction.courseId);
    } else {
      rejectMutation.mutate(confirmAction.courseId);
    }
    setConfirmAction(null);
  }

  const underReviewCount = courses.filter((c) => c.status === "UNDER_REVIEW").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Course Reviews
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve instructor-submitted courses
          </p>
        </div>
        {filter === "UNDER_REVIEW" && underReviewCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
            <span className="text-amber-600 dark:text-amber-400 font-black text-lg">
              {underReviewCount}
            </span>
            <span className="text-amber-600 dark:text-amber-500 text-sm font-semibold">
              awaiting review
            </span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <IconFilter size={16} className="text-muted-foreground" />
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-bold transition-all",
              filter === value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center py-20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconBook size={28} className="text-muted-foreground" />
          </div>
          <p className="font-black text-gray-900 dark:text-white text-lg mb-1">
            No courses found
          </p>
          <p className="text-sm text-muted-foreground">
            {filter === "UNDER_REVIEW"
              ? "No courses are pending review right now."
              : "No courses match this filter."}
          </p>
        </div>
      )}

      {/* Course list */}
      {!isLoading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => {
            const statusCfg = STATUS_CONFIG[course.status];
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Thumbnail */}
                <div className="shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full sm:w-32 h-20 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full sm:w-32 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                      <IconBook size={24} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight">
                          {course.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-bold", statusCfg.className)}
                        >
                          {statusCfg.label}
                        </Badge>
                      </div>
                      {course.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {course.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <IconUser size={12} />
                      {course.instructor.firstName} {course.instructor.lastName}
                      <span className="text-muted-foreground/60">
                        ({course.instructor.email})
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <IconBook size={12} />
                      {course._count.chapters} chapter{course._count.chapters !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconClock size={12} />
                      {formatDuration(course.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconChartBar size={12} />
                      {LEVEL_LABELS[course.level] ?? course.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCurrencyDollar size={12} />
                      {course.pricingType === "FREE"
                        ? "Free"
                        : course.pricingType === "PAID"
                        ? `$${course.price}`
                        : "Subscription"}
                    </span>
                    {course.category && (
                      <span className="font-medium text-foreground">
                        {course.category.name}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/a/courses/${course.id}`}
                      className="inline-flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <IconExternalLink size={13} />
                      View Details
                    </Link>
                  </div>

                  {course.status === "UNDER_REVIEW" && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        disabled={isMutating}
                        onClick={() =>
                          setConfirmAction({
                            courseId: course.id,
                            type: "approve",
                            courseTitle: course.title,
                          })
                        }
                        className="h-8 px-4 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white gap-1.5"
                      >
                        <IconCheck size={14} />
                        Approve & Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isMutating}
                        onClick={() =>
                          setConfirmAction({
                            courseId: course.id,
                            type: "reject",
                            courseTitle: course.title,
                          })
                        }
                        className="h-8 px-4 rounded-xl font-bold text-destructive border-destructive/30 hover:bg-destructive/5 gap-1.5"
                      >
                        <IconX size={14} />
                        Reject
                      </Button>
                    </div>
                  )}

                  {course.status === "PUBLISHED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isMutating}
                      onClick={() =>
                        setConfirmAction({
                          courseId: course.id,
                          type: "reject",
                          courseTitle: course.title,
                        })
                      }
                      className="h-8 px-4 rounded-xl font-bold text-destructive border-destructive/30 hover:bg-destructive/5 gap-1.5"
                    >
                      <IconX size={14} />
                      Unpublish
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm dialog */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(v) => !v && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "approve"
                ? "Approve & Publish Course?"
                : "Reject Course?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "approve" ? (
                <>
                  <strong>{confirmAction.courseTitle}</strong> will be published
                  and visible to all students on the platform.
                </>
              ) : (
                <>
                  <strong>{confirmAction?.courseTitle}</strong> will be moved
                  back to Draft. The instructor will need to resubmit after
                  making changes.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={cn(
                confirmAction?.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive hover:bg-destructive/90"
              )}
            >
              {confirmAction?.type === "approve" ? "Approve & Publish" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
