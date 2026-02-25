"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconGripVertical,
  IconPencil,
  IconTrash,
  IconVideo,
  IconClock,
  IconEye,
  IconLock,
} from "@tabler/icons-react";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl?: string | null;
  isFree: boolean;
  isPublished: boolean;
}

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

function formatDuration(seconds: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LessonCard({ lesson, onEdit, onDelete }: LessonCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dur = formatDuration(lesson.duration);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
        isDragging && "opacity-50 shadow-xl ring-2 ring-purple-500 z-50"
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-gray-500 touch-none p-1"
      >
        <IconGripVertical size={16} />
      </button>

      {/* Video indicator */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        lesson.videoUrl
          ? "bg-purple-100 dark:bg-purple-950/40 text-purple-600"
          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
      )}>
        <IconVideo size={15} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{lesson.title}</p>
        <div className="flex items-center gap-3 mt-0.5">
          {dur && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <IconClock size={11} /> {dur}
            </span>
          )}
          {lesson.isFree ? (
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-semibold">
              <IconEye size={11} /> Free
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <IconLock size={11} /> Enrolled
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-blue-600"
          onClick={() => onEdit(lesson)}
        >
          <IconPencil size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(lesson.id)}
        >
          <IconTrash size={14} />
        </Button>
      </div>
    </div>
  );
}
