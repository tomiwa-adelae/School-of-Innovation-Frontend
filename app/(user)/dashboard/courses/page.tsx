"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, deleteData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
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
  IconPlus,
  IconPencil,
  IconTrash,
  IconLock,
  IconLoader2,
  IconClock,
  IconBook,
  IconPhoto,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  thumbnail?: string | null;
  status: string;
  pricingType: string;
  price?: number | null;
  level: string;
  duration: number;
  category?: { id: string; name: string } | null;
  _count: { chapters: number };
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  PUBLISHED: { label: "Published", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" },
  ARCHIVED: { label: "Archived", className: "bg-gray-100 text-gray-400 dark:bg-gray-800" },
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
};

function formatDuration(seconds: number) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isApproved = user?.role === "INSTRUCTOR" && user?.instructorStatus === "APPROVED";

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["myCourses"],
    queryFn: () => fetchData("/courses/my"),
    enabled: isApproved,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteData(`/courses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myCourses"] });
      toast.success("Course deleted");
    },
    onError: () => toast.error("Failed to delete course"),
  });

  // Not an approved instructor
  if (!isApproved) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <IconLock size={28} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Courses Unavailable
        </h2>
        <p className="text-muted-foreground mb-6">
          {user?.role !== "INSTRUCTOR"
            ? "Only instructors can create courses."
            : "Your instructor application is pending admin approval. You'll be able to create courses once approved."}
        </p>
        <Button asChild variant="outline" className="rounded-2xl font-bold">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button
          asChild
          className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black gap-2"
        >
          <Link href="/dashboard/courses/create">
            <IconPlus size={16} /> Create Course
          </Link>
        </Button>
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
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconBook size={28} className="text-purple-500" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2">No courses yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Create your first course to start teaching students.
          </p>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold gap-2"
          >
            <Link href="/dashboard/courses/create">
              <IconPlus size={16} /> Create a Course
            </Link>
          </Button>
        </div>
      )}

      {/* Course grid */}
      {!isLoading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const status = STATUS_CONFIG[course.status] ?? STATUS_CONFIG.DRAFT;
            const dur = formatDuration(course.duration);

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconPhoto size={32} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-full",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-black text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2">
                    {course.title}
                  </h3>

                  {course.shortDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {course.shortDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span>{LEVEL_LABELS[course.level] ?? course.level}</span>
                    <span>·</span>
                    <span>{course._count.chapters} chapters</span>
                    {dur && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <IconClock size={10} /> {dur}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl font-semibold gap-1.5 text-xs"
                    >
                      <Link href={`/dashboard/courses/${course.id}/edit`}>
                        <IconPencil size={12} /> Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
                      onClick={() => setDeletingId(course.id)}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the course and all its chapters and lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingId) deleteMutation.mutate(deletingId);
                setDeletingId(null);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
