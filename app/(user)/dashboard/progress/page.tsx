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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <IconChartHistogram size={28} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          No progress yet
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          Enroll in a course and start completing lessons to track your progress
          here.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          Browse Courses <IconArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          My Progress
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your learning journey across all enrolled courses.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
          >
            <Icon size={22} className={cn("mb-3", color)} />
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Per-course list */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-900 dark:text-white">
          Course Progress
        </h2>

        {courses.map((course) => (
          <div
            key={course.courseId}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col sm:flex-row gap-4"
          >
            {/* Thumbnail */}
            <div className="shrink-0 w-full sm:w-36 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
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

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-gray-900 dark:text-white line-clamp-1 mb-0.5">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {course.instructor.firstName} {course.instructor.lastName}
              </p>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    {course.completedLessons} of {course.totalLessons} lessons
                    completed
                  </span>
                  <span className="text-xs font-black text-blue-600">
                    {course.percent}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      course.percent === 100 ? "bg-green-500" : "bg-blue-600"
                    )}
                    style={{ width: `${course.percent}%` }}
                  />
                </div>
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
                <Link
                  href={`/learn/${course.courseId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shrink-0"
                >
                  <IconPlayerPlay size={12} />
                  {course.percent === 100 ? "Review" : "Continue"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
