"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { updateData } from "@/lib/api";
import { CourseBasicsInput } from "@/lib/zodSchemas";
import { useAutosave } from "@/hooks/useAutosave";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { CourseQuickStart } from "./CourseQuickStart";
import { CourseBasicsForm } from "./CourseBasicsForm";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { CourseReview } from "./CourseReview";
import { PublishChecklist, readinessKey } from "./PublishChecklist";
import { CollaboratorsPanel } from "./CollaboratorsPanel";
import { SaveIndicator } from "./SaveIndicator";

type Tab = "details" | "curriculum" | "publish";

const TABS: { id: Tab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "curriculum", label: "Curriculum" },
  { id: "publish", label: "Publish" },
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
    learningOutcomes: course.learningOutcomes ?? [],
    requirements: course.requirements ?? [],
    targetAudience: course.targetAudience ?? [],
  };
}

export function CourseWizard({
  mode,
  courseId,
  initialData,
}: CourseWizardProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("details");

  // A course is created from its title alone, then lives at its own URL so a
  // refresh or a closed tab can never discard it.
  const handleCreated = useCallback(
    (newId: string) => {
      qc.invalidateQueries({ queryKey: ["my-courses"] });
      router.replace(`/dashboard/courses/${newId}/edit`);
    },
    [qc, router],
  );

  const persist = useCallback(
    async (values: Partial<CourseBasicsInput>) => {
      if (!courseId) return;
      await updateData(`/courses/${courseId}`, values);
      qc.invalidateQueries({ queryKey: readinessKey(courseId) });
    },
    [courseId, qc],
  );

  const { save, saveNow, status, lastSavedAt } = useAutosave<
    Partial<CourseBasicsInput>
  >({
    onSave: persist,
    enabled: !!courseId,
  });

  if (mode === "create" || !courseId) {
    return <CourseQuickStart onCreated={handleCreated} />;
  }

  const isOwner = initialData?.myRole
    ? initialData.myRole === "OWNER"
    : true;
  const canEdit = initialData?.canEdit ?? true;

  async function handleManualSave() {
    try {
      await saveNow();
      toast.success("Saved");
    } catch {
      toast.error("Could not save — check your connection");
    }
  }

  return (
    <div className="py-6 space-y-6">
      {/* Tabs — free navigation, no forced back/forward through a wizard */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
                tab === t.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SaveIndicator
          status={status}
          lastSavedAt={lastSavedAt}
          className="pb-2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="min-w-0">
          {tab === "details" && (
            <CourseBasicsForm
              initialData={initialData ? mapCourseToForm(initialData) : undefined}
              onChange={save}
              onSubmit={handleManualSave}
              readOnly={!canEdit}
              isOwner={isOwner}
            />
          )}

          {tab === "curriculum" && (
            <CurriculumBuilder
              courseId={courseId}
              onBack={() => setTab("details")}
              onContinue={() => setTab("publish")}
            />
          )}

          {tab === "publish" && (
            <CourseReview courseId={courseId} onBack={() => setTab("curriculum")} />
          )}
        </div>

        {/* Persistent rail: what is left to do, and who is working on it */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <PublishChecklist courseId={courseId} />
          <CollaboratorsPanel courseId={courseId} isOwner={isOwner} />
        </aside>
      </div>
    </div>
  );
}
