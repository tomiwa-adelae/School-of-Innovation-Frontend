"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  IconBook,
  IconClock,
  IconChartHistogram,
  IconCheck,
  IconLoader2,
  IconPlayerPlay,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CourseProgress {
  courseId: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  instructor: { id: string; firstName: string; lastName: string };
  totalLessons: number;
  completedLessons: number;
  percent: number;
  lastActivityAt: string | null;
  watchedSeconds: number;
}

interface ProgressOverview {
  courses: CourseProgress[];
  totalEnrolled: number;
  totalCompletedLessons: number;
  totalWatchedSeconds: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (!seconds) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const { data, isLoading } = useQuery<ProgressOverview>({
    queryKey: ["progress-overview"],
    queryFn: () => fetchData("/enrollments/progress/overview"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const courses = data?.courses ?? [];
  const totalEnrolled = data?.totalEnrolled ?? 0;
  const totalCompletedLessons = data?.totalCompletedLessons ?? 0;
  const totalWatchedSeconds = data?.totalWatchedSeconds ?? 0;

  if (courses.length === 0) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-md flex items-center justify-center mx-auto mb-4">
          <IconChartHistogram size={28} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No progress yet</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          Enroll in a course and start completing lessons to track your progress
          here.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        back
        title="My Progress"
        description="Track your learning journey across all enrolled courses."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          {
            label: "Enrolled Courses",
            value: String(totalEnrolled),
            icon: IconBook,
            color: "text-blue-500",
          },
          {
            label: "Lessons Completed",
            value: String(totalCompletedLessons),
            icon: IconCheck,
            color: "text-green-500",
          },
          {
            label: "Hours Watched",
            value: formatDuration(totalWatchedSeconds),
            icon: IconClock,
            color: "text-purple-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent>
              <Icon size={22} className={cn("mb-3", color)} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-course list */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.map((course) => (
            <Card
              className="py-0 md:p-3 gap-0 flex flex-col md:flex-row overflow-hidden"
              key={course.courseId}
            >
              <div className="shrink-0 rounded-none md:rounded-md aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={144}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconBook size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <CardContent className="mt-4 pb-4 md:pb-0 md:mt-0 w-full">
                {/* Thumbnail */}

                {/* Info */}
                <div className="flex-1">
                  <CardTitle className="line-clamp-1 mb-0.5">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs mb-3">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </CardDescription>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-muted-foreground">
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons completed
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {course.percent}%
                      </span>
                    </div>
                    <Progress value={course.percent} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {course.watchedSeconds > 0 && (
                        <span className="flex items-center gap-1">
                          <IconClock size={11} />
                          {formatDuration(course.watchedSeconds)} watched
                        </span>
                      )}
                      {course.percent === 100 && (
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                          <IconCheck size={11} /> Completed
                        </span>
                      )}
                    </div>
                    <Button asChild size={"sm"}>
                      <Link href={`/learn/${course.courseId}`}>
                        <IconPlayerPlay />
                        {course.percent === 100 ? "Review" : "Continue"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
