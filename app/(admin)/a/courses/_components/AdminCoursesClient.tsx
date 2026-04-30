"use client";

import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatMoneyInput } from "@/lib/utils";
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
  IconBuilding,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import { Loader } from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";

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
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: { chapters: number };
}

const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  PUBLISHED: {
    label: "Published",
    className:
      "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  ARCHIVED: {
    label: "Archived",
    className:
      "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
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
        filter === "ALL" ? "/a/courses" : `/a/courses?status=${filter}`,
      ),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => updateData(`/a/courses/${id}/approve`, {}),
    onSuccess: () => {
      toast.success("Course approved and published!");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: () => toast.error("Failed to approve course"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => updateData(`/a/courses/${id}/reject`, {}),
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

  const underReviewCount = courses.filter(
    (c) => c.status === "UNDER_REVIEW",
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        back
        title="Course Reviews"
        description={"Review and approve instructor-submitted courses"}
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <Button
            size="sm"
            key={value}
            onClick={() => setFilter(value)}
            variant={filter === value ? "default" : "outline"}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && courses.length === 0 && (
        <Card className="text-center py-20">
          <CardContent>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mx-auto mb-4">
              <IconBook size={20} className="text-muted-foreground" />
            </div>
            <p className="font-bold text-lg mb-1">No courses found</p>
            <p className="text-sm text-muted-foreground">
              {filter === "UNDER_REVIEW"
                ? "No courses are pending review right now."
                : "No courses match this filter."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course list */}
      {!isLoading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => {
            const statusCfg = STATUS_CONFIG[course.status];
            return (
              <Card key={course.id} className="overflow-hidden px-0 py-4">
                <CardContent className="flex flex-col sm:flex-row gap-4 px-4">
                  {/* Left Side: Thumbnail - Fixed aspect/size on desktop */}
                  <div className="w-full sm:w-64 shrink-0 rounded-md overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full aspect-video sm:aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-full h-full aspect-video sm:aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <IconBook
                          size={32}
                          className="text-muted-foreground/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/a/courses/${course.id}`}
                              className="font-bold hover:underline hover:text-primary text-lg"
                            >
                              {course.title}
                            </Link>
                            <Badge
                              variant="outline"
                              className={cn(statusCfg.className)}
                            >
                              {statusCfg.label}
                            </Badge>
                          </div>
                          {course.shortDescription && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {course.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Meta Grid - Organized Info */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-4">
                        <MetaItem
                          icon={<IconUser size={14} />}
                          label={`${course.instructor.firstName} ${course.instructor.lastName}`}
                        />
                        <MetaItem
                          icon={<IconBook size={14} />}
                          label={`${course._count.chapters} Chapters`}
                        />
                        <MetaItem
                          icon={<IconClock size={14} />}
                          label={formatDuration(course.duration)}
                        />
                        <MetaItem
                          icon={<IconChartBar size={14} />}
                          label={LEVEL_LABELS[course.level] ?? course.level}
                        />
                        <MetaItem
                          icon={<NairaIcon />}
                          label={
                            course.pricingType === "FREE"
                              ? "Free"
                              : course.pricingType === "PAID"
                                ? `${formatMoneyInput(course.price!)}`
                                : "Subscription"
                          }
                        />
                        {course.category && (
                          <MetaItem
                            icon={<IconBuilding size="14" />}
                            label={course.category.name}
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-50 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        {course.status === "UNDER_REVIEW" && (
                          <>
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
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <IconCheck size={14} />
                              Approve
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
                              className="text-destructive border-destructive/20 hover:bg-destructive/5"
                            >
                              <IconX size={14} />
                              Reject
                            </Button>
                          </>
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
                            className="text-destructive border-destructive/20 hover:bg-destructive/5"
                          >
                            <IconX size={14} />
                            Unpublish
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-muted-foreground"
                      >
                        <Link href={`/a/courses/${course.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  : "bg-destructive hover:bg-destructive/90",
              )}
            >
              {confirmAction?.type === "approve"
                ? "Approve & Publish"
                : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MetaItem({ icon, label }: any) {
  return (
    <div className="flex items-center text-muted-foreground gap-1 text-sm min-w-0">
      <span className="shrink-0 text-muted-foreground/70">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
