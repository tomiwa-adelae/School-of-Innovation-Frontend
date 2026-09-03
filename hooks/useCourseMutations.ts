import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData, deleteData } from "@/lib/api";
import { ChapterInput, LessonInput } from "@/lib/zodSchemas";
import { toast } from "sonner";

export function useCourseMutations(courseId: string | null) {
  const qc = useQueryClient();

  function invalidate() {
    if (!courseId) return;
    qc.invalidateQueries({ queryKey: ["course", courseId] });
    // The publish checklist counts lessons and videos, so it moves whenever
    // the curriculum does.
    qc.invalidateQueries({ queryKey: ["course-readiness", courseId] });
  }

  /** A 409 here means a collaborator saved first — say so plainly. */
  function conflictAwareError(fallback: string) {
    return (err: any) => {
      if (err?.response?.status === 409) {
        toast.error(
          err?.response?.data?.message ??
            "Someone else saved this while you were editing. Reload before saving again.",
        );
        invalidate();
        return;
      }
      toast.error(fallback);
    };
  }

  // ─── Chapters ───────────────────────────────────────────────────────────────

  const createChapter = useMutation({
    mutationFn: (dto: Partial<ChapterInput>) =>
      postData(`/courses/${courseId}/chapters`, dto),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to add chapter"),
  });

  const updateChapter = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChapterInput> & { isPublished?: boolean } }) =>
      updateData(`/chapters/${id}`, data),
    onSuccess: invalidate,
    onError: conflictAwareError("Failed to update chapter"),
  });

  const deleteChapter = useMutation({
    mutationFn: (id: string) => deleteData(`/chapters/${id}`),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to delete chapter"),
  });

  const reorderChapters = useMutation({
    mutationFn: (ids: string[]) =>
      updateData(`/courses/${courseId}/chapters/reorder`, { ids }),
    onSuccess: invalidate,
    onError: () => {
      toast.error("Failed to reorder chapters");
      invalidate();
    },
  });

  // ─── Lessons ────────────────────────────────────────────────────────────────

  const createLesson = useMutation({
    mutationFn: ({ chapterId, data }: { chapterId: string; data: Partial<LessonInput> }) =>
      postData(`/chapters/${chapterId}/lessons`, data),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to add lesson"),
  });

  const updateLesson = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LessonInput> & {
        isPublished?: boolean;
        /** The updatedAt the editor was opened with — see assertNotStale. */
        expectedUpdatedAt?: string;
      };
    }) => updateData(`/lessons/${id}`, data),
    onSuccess: invalidate,
    onError: conflictAwareError("Failed to update lesson"),
  });

  const deleteLesson = useMutation({
    mutationFn: (id: string) => deleteData(`/lessons/${id}`),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to delete lesson"),
  });

  const reorderLessons = useMutation({
    mutationFn: ({ chapterId, ids }: { chapterId: string; ids: string[] }) =>
      updateData(`/chapters/${chapterId}/lessons/reorder`, { ids }),
    onSuccess: invalidate,
    onError: () => {
      toast.error("Failed to reorder lessons");
      invalidate();
    },
  });

  return {
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
  };
}
