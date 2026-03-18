"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCourseWizard } from "@/hooks/useCourseWizard";
import { CourseBasicsForm } from "./CourseBasicsForm";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { CourseReview } from "./CourseReview";
import { CourseBasicsInput } from "@/lib/zodSchemas";
import { postData, updateData } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

const STEPS = [
  { label: "Course Basics", number: 1 },
  { label: "Curriculum", number: 2 },
  { label: "Review & Publish", number: 3 },
];

interface CourseWizardProps {
  mode: "create" | "edit";
  courseId?: string;
  initialData?: any;
}

function mapCourseToForm(course: any): Partial<CourseBasicsInput> {
  return {
    title: course.title ?? "",
    shortDescription: course.shortDescription ?? "",
    description: course.description ?? "",
    categoryId: course.categoryId ?? "",
    level: course.level ?? "ALL_LEVELS",
    language: course.language ?? "English",
    pricingType: course.pricingType ?? "FREE",
    price: course.price ?? undefined,
    currency: course.currency ?? "USD",
    thumbnail: course.thumbnail ?? "",
    previewVideo: course.previewVideo ?? "",
    tags: course.tags ?? [],
    learningOutcomes: course.learningOutcomes?.length
      ? course.learningOutcomes
      : [""],
    requirements: course.requirements ?? [],
    targetAudience: course.targetAudience ?? [],
  };
}

export function CourseWizard({
  mode,
  courseId: propCourseId,
  initialData,
}: CourseWizardProps) {
  const router = useRouter();
  const { currentStep, courseId, setStep, setCourseId, reset } =
    useCourseWizard();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && propCourseId) {
      setCourseId(propCourseId);
    }
    return () => {
      if (mode === "create") reset();
    };
  }, [mode, propCourseId]);

  async function handleBasicsSubmit(data: CourseBasicsInput) {
    setIsSaving(true);
    try {
      if (mode === "create" && !courseId) {
        const res = await postData<{ id: string }>("/courses", data);
        setCourseId(res.id);
        setStep(2);
        toast.success("Course created! Now build your curriculum.");
      } else if (courseId) {
        await updateData(`/courses/${courseId}`, data);
        setStep(2);
        toast.success("Course details saved.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : (msg ?? "Failed to save course"),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Step progress */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                currentStep > step.number
                  ? "bg-blue-600 text-white"
                  : currentStep === step.number
                    ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400",
              )}
            >
              {currentStep > step.number ? (
                <IconCheck size={12} />
              ) : (
                <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                  {step.number}
                </span>
              )}
              {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {currentStep === 1 && (
        <CourseBasicsForm
          initialData={initialData ? mapCourseToForm(initialData) : undefined}
          onSubmit={handleBasicsSubmit}
          isLoading={isSaving}
        />
      )}

      {currentStep === 2 && courseId && (
        <CurriculumBuilder
          courseId={courseId}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {currentStep === 3 && courseId && (
        <CourseReview courseId={courseId} onBack={() => setStep(2)} />
      )}
    </div>
  );
}
