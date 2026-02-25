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
import { IconPlus, IconLoader2, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { toast } from "sonner";
import { LessonInput, ChapterInput } from "@/lib/zodSchemas";

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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Chapter edit sheet
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  // Lesson edit sheet
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  // Delete confirm
  const [deletingId, setDeletingId] = useState<{ id: string; type: "chapter" | "lesson" } | null>(null);

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
      }
    );
  }

  // ── Lesson save ─────────────────────────────────────────────────────────────

  function handleSaveLesson(id: string, data: Partial<LessonInput>) {
    mutations.updateLesson.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditingLesson(null);
          toast.success("Lesson saved");
        },
      }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Curriculum Builder
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add chapters and lessons. Drag to reorder — changes save automatically.
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p className="font-semibold">{localChapters.length} chapters</p>
            <p>
              {localChapters.reduce((s, c) => s + c.lessons.length, 0)} lessons
            </p>
          </div>
        </div>
      </div>

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
                onEditChapter={(c) => setEditingChapter(c)}
                onEditLesson={(l) => setEditingLesson(l)}
                onDeleteChapter={(id) => setDeletingId({ id, type: "chapter" })}
                onDeleteLesson={(id) => setDeletingId({ id, type: "lesson" })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty state */}
      {localChapters.length === 0 && (
        <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-muted-foreground font-semibold mb-2">No chapters yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Add your first chapter to start building the curriculum
          </p>
        </div>
      )}

      {/* Add chapter */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddChapter}
        disabled={mutations.createChapter.isPending}
        className="w-full h-12 rounded-2xl font-bold gap-2 border-dashed border-2"
      >
        {mutations.createChapter.isPending ? (
          <IconLoader2 size={16} className="animate-spin" />
        ) : (
          <IconPlus size={16} />
        )}
        Add Chapter
      </Button>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 px-8 rounded-2xl font-bold gap-2"
        >
          <IconArrowLeft size={18} /> Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={localChapters.length === 0}
          className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black gap-2"
        >
          Continue to Review <IconArrowRight size={18} />
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
