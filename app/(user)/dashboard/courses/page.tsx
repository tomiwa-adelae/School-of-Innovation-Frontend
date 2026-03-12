"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, deleteData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  IconPlayerPlay,
  IconSearch,
  IconChalkboard,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Loader } from "@/components/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

// ── Shared helpers ─────────────────────────────────────────────────────────────

function formatDuration(seconds: number) {
  if (!seconds) return null;
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

// ── Student: My Enrolled Courses ───────────────────────────────────────────────

interface Enrollment {
  id: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    thumbnail: string | null;
    level: string;
    pricingType: string;
    duration: number;
    instructor: { id: string; firstName: string; lastName: string };
    _count: { chapters: number };
  };
}

interface ProgressSummary {
  courses: {
    courseId: string;
    totalLessons: number;
    completedLessons: number;
    percent: number;
  }[];
}

function StudentMyCourses() {
  const [search, setSearch] = useState("");

  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: ["my-enrollments"],
    queryFn: () => fetchData("/enrollments/my"),
  });

  const { data: progressOverview } = useQuery<ProgressSummary>({
    queryKey: ["progress-overview"],
    queryFn: () => fetchData("/enrollments/progress/overview"),
  });

  const progressMap = new Map(
    (progressOverview?.courses ?? []).map((p) => [p.courseId, p]),
  );

  const filtered = enrollments.filter((e) =>
    e.course.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          back
          title="My Courses"
          description={`${enrollments.length} course${enrollments.length !== 1 ? "s" : ""} enrolled`}
        />
        <Button asChild className="w-full md:w-auto">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>

      {/* Search */}
      {enrollments.length > 0 && (
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
        </InputGroup>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      )}

      {/* Empty — no enrollments at all */}
      {!isLoading && enrollments.length === 0 && (
        <div className="text-center py-20 rounded-md border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-md flex items-center justify-center mx-auto mb-4">
            <IconBook size={28} className="text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">No courses yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Enroll in your first course to start learning something new today.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      )}

      {/* No search results */}
      {!isLoading && enrollments.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No courses match &ldquo;
          <span className="text-gray-900 dark:text-white font-semibold">
            {search}
          </span>
          &rdquo;
        </div>
      )}

      {/* Course grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
          {filtered.map((e) => {
            const { course } = e;
            const dur = formatDuration(course.duration);
            const enrolledDate = new Date(e.createdAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" },
            );

            return (
              <Card className="p-0" key={e.id}>
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconBook
                        size={32}
                        className="text-gray-300 dark:text-gray-600"
                      />
                    </div>
                  )}

                  {/* Play overlay on hover */}
                  <Link
                    href={`/learn/${course.id}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <IconPlayerPlay
                        size={18}
                        className="text-blue-600 translate-x-0.5"
                      />
                    </div>
                  </Link>

                  {/* Level badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-gray-700 dark:bg-gray-900/90 dark:text-gray-200 pointer-events-none">
                    {LEVEL_LABELS[course.level] ?? course.level}
                  </span>
                </div>

                {/* Content */}
                <CardContent className="pb-4">
                  <CardTitle className="line-clamp-2 mb-1">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs mb-3">
                    by {course.instructor.firstName}{" "}
                    {course.instructor.lastName}
                  </CardDescription>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <IconChalkboard size={10} />
                      {course._count.chapters} chapter
                      {course._count.chapters !== 1 ? "s" : ""}
                    </span>
                    {dur && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <IconClock size={10} /> {dur}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-3">
                    Enrolled {enrolledDate}
                  </p>

                  {/* Progress bar */}
                  {(() => {
                    const prog = progressMap.get(course.id);
                    if (!prog || prog.totalLessons === 0) return null;
                    return (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] text-muted-foreground">
                            {prog.completedLessons} of {prog.totalLessons}{" "}
                            lessons
                          </span>
                          <span className="text-[11px] font-bold text-blue-600">
                            {prog.percent}%
                          </span>
                        </div>
                        <div className="h-1.5rounded-full overflow-hidden">
                          <div
                            className="h-full bg- rounded-full transition-all duration-500"
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  <Button asChild className="w-full">
                    <Link href={`/learn/${course.id}`}>
                      <IconPlayerPlay /> Continue Learning
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Instructor: My Created Courses ─────────────────────────────────────────────

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
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  PUBLISHED: {
    label: "Published",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-gray-100 text-gray-400 dark:bg-gray-800",
  },
};

function InstructorMyCourses() {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["myCourses"],
    queryFn: () => fetchData("/courses/my"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteData(`/courses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myCourses"] });
      toast.success("Course deleted");
    },
    onError: () => toast.error("Failed to delete course"),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <PageHeader
          back
          title="My Courses"
          description={`${courses.length} course${courses.length !== 1 ? "s" : ""} created`}
        />

        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/courses/create">Create Course</Link>
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <IconLoader2
            size={28}
            className="animate-spin text-muted-foreground"
          />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center py-20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconBook size={28} className="text-purple-500" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2">
            No courses yet
          </h3>
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

      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
      </InputGroup>

      {/* Course grid */}
      {!isLoading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
          {courses.map((course) => {
            const status = STATUS_CONFIG[course.status] ?? STATUS_CONFIG.DRAFT;
            const dur = formatDuration(course.duration);

            return (
              <Card className="p-0 overflow-hidden" key={course.id}>
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconPhoto
                        size={32}
                        className="text-gray-300 dark:text-gray-600"
                      />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-full",
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Content */}
                <CardContent className="pb-6">
                  <CardTitle className="line-clamp-2 mb-2">
                    {course.title}
                  </CardTitle>

                  {course.shortDescription && (
                    <CardDescription className="line-clamp-2 mb-3">
                      {course.shortDescription}
                    </CardDescription>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
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
                      className="flex-1"
                    >
                      <Link href={`/dashboard/courses/${course.id}/edit`}>
                        <IconPencil /> Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeletingId(course.id)}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete confirm dialog */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the course and all its chapters and
              lessons.
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

// ── Root: role-aware render ────────────────────────────────────────────────────

export default function CoursesPage() {
  const { user } = useAuth();

  if (user?.role === "USER") return <StudentMyCourses />;

  if (user?.role === "INSTRUCTOR" && user?.instructorStatus === "APPROVED") {
    return <InstructorMyCourses />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16rounded-2xl flex items-center justify-center mx-auto mb-4">
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
