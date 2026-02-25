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
  IconArrowRight,
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
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-2">
            Student Dashboard
          </p>
          <h1 className="text-3xl font-black mb-3">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-blue-100 max-w-md leading-relaxed">
            Continue your learning journey and unlock new skills every day.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-50 transition-colors"
          >
            Browse Courses <IconArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
          >
            <Icon size={22} className={cn("mb-3", color)} />
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            My Courses
          </h2>
          <Link
            href="/courses"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Browse more <IconArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
            <IconLoader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-10 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconBook size={28} className="text-blue-500" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2">
              No courses yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Enroll in your first course to start tracking your progress here.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              Explore Courses <IconArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {enrollments.map(({ id, course }) => (
              <Link key={id} href={`/learn/${course.id}`}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all h-full flex flex-col">
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
                        <IconPlayerPlay size={18} className="text-blue-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 flex-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {course.instructor.firstName} {course.instructor.lastName}
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
      </div>
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

  return (
    <div className="space-y-8">
      {/* Status banner */}
      {isPending && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 mt-1">
              <IconAlertCircle size={24} />
            </div>
            <div>
              <p className="text-amber-100 text-sm font-semibold uppercase tracking-widest mb-1">
                Application Under Review
              </p>
              <h1 className="text-2xl font-black mb-2">
                Hey {firstName}, you&apos;re almost in! ⏳
              </h1>
              <p className="text-amber-100 max-w-xl leading-relaxed text-sm">
                Our admin team is reviewing your instructor application. This usually takes
                up to 48 hours. We&apos;ll notify you once a decision is made.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  "Application Submitted ✓",
                  "Admin Review — In Progress",
                  "Full Access — Pending",
                ].map((s, i) => (
                  <span
                    key={s}
                    className={cn(
                      "text-xs font-bold px-3 py-1.5 rounded-full",
                      i === 0
                        ? "bg-white/30 text-white"
                        : i === 1
                          ? "bg-white/20 text-white/90"
                          : "bg-white/10 text-white/60"
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <IconCircleCheck size={20} className="text-purple-200" />
              <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest">
                Approved Instructor
              </p>
            </div>
            <h1 className="text-3xl font-black mb-3">
              Welcome, {firstName}! Start creating 🎉
            </h1>
            <p className="text-purple-100 max-w-md leading-relaxed">
              You now have full instructor access. Create courses and reach thousands of
              students across Africa.
            </p>
            <Link
              href="/dashboard/courses/create"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-2xl font-black text-sm hover:bg-purple-50 transition-colors"
            >
              Create First Course <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "—", icon: IconUsers, color: "text-purple-500" },
          { label: "Active Courses", value: "—", icon: IconBook, color: "text-blue-500" },
          { label: "Total Earnings", value: "—", icon: IconCurrencyDollar, color: "text-green-500" },
          { label: "Avg. Rating", value: "—", icon: IconChartHistogram, color: "text-amber-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={cn(
              "bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800",
              isPending && "opacity-50"
            )}
          >
            <Icon size={22} className={cn("mb-3", color)} />
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
            {isPending && (
              <p className="text-[10px] text-amber-500 font-bold mt-1 uppercase tracking-wide">
                Awaiting approval
              </p>
            )}
          </div>
        ))}
      </div>

      {/* While waiting / course creation */}
      {isPending && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="font-black text-gray-900 dark:text-white text-lg mb-6">
            While you wait…
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Explore our course catalogue",
                desc: "See how top instructors structure their content.",
                icon: IconBook,
                href: "/courses",
                color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600",
              },
              {
                title: "Complete your profile",
                desc: "A great bio helps students trust you faster.",
                icon: IconChalkboard,
                href: "/settings",
                color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600",
              },
            ].map(({ title, desc, icon: Icon, href, color }) => (
              <Link
                key={title}
                href={href}
                className="flex gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
              >
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", color)}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isApproved && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-10 text-center">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconChalkboard size={28} className="text-purple-500" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2">No courses yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Create your first course to start reaching students and earning revenue.
          </p>
          <Link
            href="/dashboard/courses/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 transition-colors"
          >
            Create a Course <IconArrowRight size={16} />
          </Link>
        </div>
      )}
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
