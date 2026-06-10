"use client";

import { useAuth } from "@/store/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import {
  IconBook,
  IconChartHistogram,
  IconFileCertificate,
  IconChalkboard,
  IconUsers,
  IconCurrencyDollar,
  IconAlertCircle,
  IconCircleCheck,
  IconRocket,
  IconTrophy,
  IconClock,
  IconPlayerPlay,
  IconLoader2,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Instructor stats ──────────────────────────────────────────────────────────

interface InstructorStats {
  totalStudents: number;
  activeCourses: number;
  totalEarnings: number;
  avgRating: number | null;
}

// ── Student Dashboard ─────────────────────────────────────────────────────────

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

function formatDuration(seconds: number) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function StudentDashboard({ firstName }: { firstName: string }) {
  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: ["my-enrollments"],
    queryFn: () => fetchData("/enrollments/my"),
  });

  const totalHours = enrollments.reduce(
    (sum, e) => sum + (e.course.duration ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <Card className="relative overflow-hidden3xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardContent>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold mb-1">
              Welcome back, {firstName}! 👋
            </CardTitle>
            <CardDescription className="text-blue-100 max-w-md leading-relaxed">
              Continue your learning journey and unlock new skills every day.
            </CardDescription>
            <Button variant={"white"} className="mt-6" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          {
            label: "Enrolled Courses",
            value: isLoading ? "—" : String(enrollments.length),
            icon: IconBook,
            color: "text-blue-500",
          },
          {
            label: "Hours of Content",
            value: isLoading ? "—" : (formatDuration(totalHours) ?? "0m"),
            icon: IconClock,
            color: "text-green-500",
          },
          {
            label: "Certificates",
            value: "0",
            icon: IconFileCertificate,
            color: "text-amber-500",
          },
          {
            label: "Streak Days",
            value: "0",
            icon: IconRocket,
            color: "text-purple-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent>
              <Icon size={22} className={cn("mb-3", color)} />
              <CardTitle className="text-lg">{value}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium mt-1">
                {label}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Courses */}
      <Card>
        <CardHeader className="flex items-center justify-between border-b">
          <CardTitle>My Courses</CardTitle>
          <Button size="sm" asChild variant={"secondary"}>
            <Link href="/courses">Browse more</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800">
              <IconLoader2
                size={24}
                className="animate-spin text-muted-foreground"
              />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-10 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-md flex items-center justify-center mx-auto mb-4">
                <IconBook size={28} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">No courses yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Enroll in your first course to start tracking your progress
                here.
              </p>
              <Button asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {enrollments.map(({ id, course }) => (
                <Link key={id} href={`/learn/${course.id}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all h-full flex flex-col">
                    <div className="relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={400}
                          height={225}
                          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full aspect-video flex items-center justify-center">
                          <IconBook size={28} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <IconPlayerPlay
                            size={18}
                            className="text-blue-600 ml-0.5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 flex-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {course.instructor.firstName}{" "}
                        {course.instructor.lastName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconBook size={11} />
                          {course._count.chapters} chapters
                        </span>
                        {formatDuration(course.duration) && (
                          <span className="flex items-center gap-1">
                            <IconClock size={11} />
                            {formatDuration(course.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Instructor Dashboard ──────────────────────────────────────────────────────

function InstructorDashboard({
  firstName,
  instructorStatus,
}: {
  firstName: string;
  instructorStatus: string | null;
}) {
  const isPending = instructorStatus === "PENDING";
  const isApproved = instructorStatus === "APPROVED";

  const { data: stats, isLoading: statsLoading } = useQuery<InstructorStats>({
    queryKey: ["instructor-stats"],
    queryFn: () => fetchData("/courses/my/stats"),
    enabled: isApproved,
  });

  return (
    <div className="space-y-4">
      {/* Status banner */}
      {isPending && (
        <Card className="relative bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center shrink-0 mt-1">
                <IconAlertCircle size={24} />
              </div>
              <div>
                <p className="text-amber-100 text-xs font-semibold mb-1">
                  Application Under Review
                </p>
                <h1 className="text-2xl font-bold mb-2">
                  Hey {firstName}, you&apos;re almost in! ⏳
                </h1>
                <p className="text-white max-w-xl leading-relaxed text-sm">
                  Our admin team is reviewing your instructor profile. You can
                  start building your courses right now — they&apos;ll go live
                  once your account is approved, usually within 48 hours.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Application Submitted ✓",
                    "Admin Review — In Progress",
                    "Course Publishing — Pending Approval",
                  ].map((s, i) => (
                    <span
                      key={s}
                      className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-full",
                        i === 0
                          ? "bg-white/30 text-white"
                          : i === 1
                            ? "bg-white/20 text-white/90"
                            : "bg-white/10 text-white/60",
                      )}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isApproved && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <CardContent>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-3">
                <IconCircleCheck size={14} className="text-purple-200" />
                <p className="text-purple-200 text-xs font-medium">
                  Approved Instructor
                </p>
              </div>
              <h1 className="text-3xl font-bold mb-3">
                Welcome, {firstName}! Start creating 🎉
              </h1>
              <p className="text-white max-w-md leading-relaxed">
                You now have full instructor access. Create courses and reach
                thousands of students across Africa.
              </p>
              <Button
                className="mt-6 text-purple-700"
                asChild
                variant={"white"}
              >
                <Link href="/dashboard/courses/create">
                  Create First Course
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          {
            label: "Total Students",
            value: isApproved
              ? statsLoading ? null : String(stats?.totalStudents ?? 0)
              : "—",
            icon: IconUsers,
            color: "text-purple-500",
          },
          {
            label: "Active Courses",
            value: isApproved
              ? statsLoading ? null : String(stats?.activeCourses ?? 0)
              : "—",
            icon: IconBook,
            color: "text-blue-500",
          },
          {
            label: "Total Earnings",
            value: isApproved
              ? statsLoading
                ? null
                : `₦${(stats?.totalEarnings ?? 0).toLocaleString("en-NG")}`
              : "—",
            icon: IconCurrencyDollar,
            color: "text-green-500",
          },
          {
            label: "Avg. Rating",
            value: isApproved
              ? statsLoading ? null : (stats?.avgRating != null ? `${stats.avgRating} / 5` : "No reviews")
              : "—",
            icon: IconChartHistogram,
            color: "text-amber-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent>
              <Icon size={22} className={cn("mb-3", color)} />
              {value === null ? (
                <div className="h-7 w-16 bg-muted animate-pulse rounded mb-1" />
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{isPending ? "Get a head start" : "Quick actions"}</CardTitle>
          {isPending && (
            <CardDescription>
              Your courses will go live once your account is approved — start building now.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Create a Course",
              desc: isPending
                ? "Build your first course — it'll publish once you're approved."
                : "Start building and reach thousands of students.",
              icon: IconChalkboard,
              href: "/dashboard/courses/create",
              color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600",
            },
            {
              title: "Explore the catalogue",
              desc: "See how top instructors structure their content.",
              icon: IconBook,
              href: "/courses",
              color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600",
            },
            {
              title: "Complete your profile",
              desc: "A great bio helps students trust you faster.",
              icon: IconTrophy,
              href: "/settings",
              color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600",
            },
          ].map(({ title, desc, icon: Icon, href, color }) => (
            <Link
              key={title}
              href={href}
              className="flex gap-4 p-5 rounded-md border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  color,
                )}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  if (user.role === "INSTRUCTOR") {
    return (
      <InstructorDashboard
        firstName={user.firstName}
        instructorStatus={user.instructorStatus}
      />
    );
  }

  return <StudentDashboard firstName={user.firstName} />;
}
