"use client";

import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CourseWizard } from "@/components/course-builder/CourseWizard";
import { IconLoader2 } from "@tabler/icons-react";

export default function CreateCoursePage() {
  const { user, _hasHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "INSTRUCTOR") {
      router.replace("/dashboard");
      return;
    }
    if (user.instructorStatus !== "APPROVED") {
      router.replace("/dashboard");
    }
  }, [user, _hasHydrated, router]);

  if (!_hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user.role !== "INSTRUCTOR" || user.instructorStatus !== "APPROVED") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <h1 className="text-lg font-black text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fill in the details, build your curriculum, then publish for review.
        </p>
      </div>
      <CourseWizard mode="create" />
    </div>
  );
}
