"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { CourseWizard } from "@/components/course-builder/CourseWizard";
import { IconLoader2 } from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";

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
    <div className="min-h-screen">
      <PageHeader
        back
        title="Edit Course"
        description={`Edit: ${course.title}`}
      />
      <CourseWizard mode="edit" courseId={courseId} initialData={course} />
    </div>
  );
}
