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
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconGripVertical,
  IconPencil,
  IconTrash,
  IconChevronDown,
  IconPlus,
  IconEye,
} from "@tabler/icons-react";
import { LessonCard } from "./LessonCard";
import { useCourseMutations } from "@/hooks/useCourseMutations";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl?: string | null;
  isFree: boolean;
  isPublished: boolean;
}

interface Chapter {
  id: string;
  title: string;
  isFree: boolean;
  isPublished: boolean;
  lessons: Lesson[];
}

interface ChapterCardProps {
  chapter: Chapter;
  courseId: string;
  onEditChapter: (chapter: Chapter) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteChapter: (id: string) => void;
  onDeleteLesson: (id: string) => void;
}

export function ChapterCard({
  chapter,
  courseId,
  onEditChapter,
  onEditLesson,
  onDeleteChapter,
  onDeleteLesson,
}: ChapterCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [localLessons, setLocalLessons] = useState<Lesson[]>(chapter.lessons);
  const mutations = useCourseMutations(courseId);

  // Sync local lessons whenever server data changes (edits, reorders, adds, deletes)
  useEffect(() => {
    setLocalLessons(chapter.lessons);
  }, [chapter.lessons]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleLessonDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = localLessons.findIndex((l) => l.id === active.id);
    const newIdx = localLessons.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(localLessons, oldIdx, newIdx);
    setLocalLessons(reordered);

    mutations.reorderLessons.mutate({
      chapterId: chapter.id,
      ids: reordered.map((l) => l.id),
    });
  }

  async function handleAddLesson() {
    try {
      await mutations.createLesson.mutateAsync({
        chapterId: chapter.id,
        data: { title: "New Lesson" },
      });
      toast.success("Lesson added");
    } catch {}
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-hidden",
        isDragging && "opacity-50 shadow-2xl ring-2 ring-blue-500 z-50",
      )}
    >
      {/* Chapter header */}
      <div className="flex items-center gap-3 p-4">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-gray-500 touch-none p-1"
        >
          <IconGripVertical size={18} />
        </button>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 flex-1 text-left min-w-0"
        >
          <IconChevronDown
            size={16}
            className={cn(
              "text-muted-foreground transition-transform shrink-0",
              expanded ? "rotate-0" : "-rotate-90",
            )}
          />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-white truncate">
              {chapter.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {chapter.lessons.length} lesson
              {chapter.lessons.length !== 1 ? "s" : ""}
              {chapter.isFree && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-semibold inline-flex items-center gap-0.5">
                  <IconEye size={10} /> Free
                </span>
              )}
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
            onClick={() => onEditChapter(chapter)}
          >
            <IconPencil size={15} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteChapter(chapter.id)}
          >
            <IconTrash size={15} />
          </Button>
        </div>
      </div>

      {/* Lessons */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleLessonDragEnd}
          >
            <SortableContext
              items={localLessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {localLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={onEditLesson}
                  onDelete={onDeleteLesson}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddLesson}
            disabled={mutations.createLesson.isPending}
            className="w-full gap-2 rounded-md text-xs font-semibold text-muted-foreground hover:text-blue-600 border border-dashed border-gray-200 dark:border-gray-700 mt-1"
          >
            <IconPlus size={14} />
            Add Lesson
          </Button>
        </div>
      )}
    </div>
  );
}
