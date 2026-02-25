"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { CourseWizard } from "@/components/course-builder/CourseWizard";
import { IconLoader2 } from "@tabler/icons-react";

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: course, isLoading } = useQuery<any>({
    queryKey: ["course", courseId],
    queryFn: () => fetchData(`/courses/${courseId}`),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <h1 className="text-lg font-black text-gray-900 dark:text-white">
          Edit Course
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-lg">
          {course.title}
        </p>
      </div>
      <CourseWizard mode="edit" courseId={courseId} initialData={course} />
    </div>
  );
}
