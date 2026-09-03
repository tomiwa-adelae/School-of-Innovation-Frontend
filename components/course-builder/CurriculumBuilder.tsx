"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { useCourseMutations } from "@/hooks/useCourseMutations";
import { ChapterCard } from "./ChapterCard";
import { ChapterEditor } from "./ChapterEditor";
import { BulkVideoDrop } from "./BulkVideoDrop";
import { LessonEditor } from "./LessonEditor";
import { Button } from "@/components/ui/button";
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
  IconLoader2,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { LessonInput, ChapterInput } from "@/lib/zodSchemas";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  isFree: boolean;
  isPublished: boolean;
  isDownloadable: boolean;
  resources?: any[];
  /** Echoed back on save so a collaborator's concurrent edit is not clobbered. */
  updatedAt?: string;
}

interface Chapter {
  id: string;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  isFree: boolean;
  isPublished: boolean;
  lessons: Lesson[];
}

interface CurriculumBuilderProps {
  courseId: string;
  onBack: () => void;
  onContinue: () => void;
}

export function CurriculumBuilder({
  courseId,
  onBack,
  onContinue,
}: CurriculumBuilderProps) {
  const mutations = useCourseMutations(courseId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Chapter edit sheet
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  // Lesson edit sheet
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  // Delete confirm
  const [deletingId, setDeletingId] = useState<{
    id: string;
    type: "chapter" | "lesson";
  } | null>(null);

  const { data: course, isLoading } = useQuery<{ chapters: Chapter[] }>({
    queryKey: ["course", courseId],
    queryFn: () => fetchData(`/courses/${courseId}`),
  });

  const [localChapters, setLocalChapters] = useState<Chapter[]>([]);

  // Sync local chapters whenever server data changes (title edits, reorders, adds, deletes)
  useEffect(() => {
    if (course?.chapters) {
      setLocalChapters(course.chapters);
    }
  }, [course]);

  // ── Chapter DnD ─────────────────────────────────────────────────────────────

  function handleChapterDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = localChapters.findIndex((c) => c.id === active.id);
    const newIdx = localChapters.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(localChapters, oldIdx, newIdx);
    setLocalChapters(reordered);

    mutations.reorderChapters.mutate(reordered.map((c) => c.id));
  }

  // ── Add chapter ─────────────────────────────────────────────────────────────

  async function handleAddChapter() {
    try {
      await mutations.createChapter.mutateAsync({ title: "New Chapter" });
      toast.success("Chapter added");
    } catch {}
  }

  // ── Chapter save ────────────────────────────────────────────────────────────

  function handleSaveChapter(id: string, data: Partial<ChapterInput>) {
    mutations.updateChapter.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditingChapter(null);
          toast.success("Chapter saved");
        },
      },
    );
  }

  // ── Lesson save ─────────────────────────────────────────────────────────────

  function handleSaveLesson(id: string, data: Partial<LessonInput>) {
    // Send back the version this editor was opened with. If another
    // collaborator has saved since, the API returns 409 instead of
    // silently overwriting their work.
    const expectedUpdatedAt = localChapters
      .flatMap((c) => c.lessons)
      .find((l) => l.id === id)?.updatedAt;

    mutations.updateLesson.mutate(
      { id, data: { ...data, ...(expectedUpdatedAt && { expectedUpdatedAt }) } },
      {
        onSuccess: () => {
          setEditingLesson(null);
          toast.success("Lesson saved");
        },
      },
    );
  }

  // ── Delete confirm ──────────────────────────────────────────────────────────

  function handleConfirmDelete() {
    if (!deletingId) return;
    if (deletingId.type === "chapter") {
      mutations.deleteChapter.mutate(deletingId.id, {
        onSuccess: () => toast.success("Chapter deleted"),
      });
    } else {
      mutations.deleteLesson.mutate(deletingId.id, {
        onSuccess: () => toast.success("Lesson deleted"),
      });
    }
    setDeletingId(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Curriculum Builder</CardTitle>
            <CardDescription>
              Add chapters and lessons. Drag to reorder — changes save
              automatically.
            </CardDescription>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p className="font-semibold">{localChapters.length} chapters</p>
            <p>
              {localChapters.reduce((s, c) => s + c.lessons.length, 0)} lessons
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Bulk video drop — the fast path.
          Targets the last section so a flat course needs no chapter thinking;
          fine-grained edits still happen per lesson below. */}
      {localChapters.length > 0 && (
        <BulkVideoDrop
          courseId={courseId}
          chapterId={localChapters[localChapters.length - 1].id}
          chapterTitle={localChapters[localChapters.length - 1].title}
        />
      )}

      {/* Chapter list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleChapterDragEnd}
      >
        <SortableContext
          items={localChapters.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {localChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                courseId={courseId}
                // @ts-ignore
                onEditChapter={(c) => setEditingChapter(c)}
                // @ts-ignore
                onEditLesson={(l) => setEditingLesson(l)}
                onDeleteChapter={(id) => setDeletingId({ id, type: "chapter" })}
                onDeleteLesson={(id) => setDeletingId({ id, type: "lesson" })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty state — new courses ship with "Section 1", so this only shows
          if every section was deleted. */}
      {localChapters.length === 0 && (
        <div className="text-center py-16 rounded-md border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-muted-foreground font-semibold mb-2">
            No sections yet
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Add a section, then drop your videos in to create lessons
          </p>
        </div>
      )}

      {/* Add chapter */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddChapter}
        disabled={mutations.createChapter.isPending}
        className="w-full h-12 rounded-md font-bold gap-2 border-dashed border-2"
      >
        {mutations.createChapter.isPending ? (
          <IconLoader2 size={16} className="animate-spin" />
        ) : (
          <IconPlus size={16} />
        )}
        Add Section
      </Button>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={localChapters.length === 0}
        >
          Continue to Review
        </Button>
      </div>

      {/* Chapter editor sheet */}
      <ChapterEditor
        open={!!editingChapter}
        chapter={editingChapter}
        onClose={() => setEditingChapter(null)}
        onSave={handleSaveChapter}
        isSaving={mutations.updateChapter.isPending}
      />

      {/* Lesson editor sheet */}
      <LessonEditor
        open={!!editingLesson}
        lesson={editingLesson}
        onClose={() => setEditingLesson(null)}
        onSave={handleSaveLesson}
        isSaving={mutations.updateLesson.isPending}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deletingId?.type === "chapter" ? "Chapter" : "Lesson"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
              {deletingId?.type === "chapter" &&
                " All lessons inside this chapter will also be deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
