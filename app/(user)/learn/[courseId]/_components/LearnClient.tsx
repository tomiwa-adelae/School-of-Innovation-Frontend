"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchData, postData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconPlayerPlay,
  IconLoader2,
  IconLock,
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconBook,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Resource {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number | null;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  description: string | null;
  isFree: boolean;
  isDownloadable: boolean;
  resources: Resource[];
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  chapters: Chapter[];
}

function formatDuration(seconds: number) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extractText(raw: string | null): string {
  if (!raw) return "";
  try {
    const doc = JSON.parse(raw);
    const lines: string[] = [];
    function walk(node: any) {
      if (node.type === "text") lines.push(node.text ?? "");
      else if (node.type === "hardBreak") lines.push("\n");
      else if (Array.isArray(node.content)) {
        node.content.forEach(walk);
        if (
          ["paragraph", "heading", "listItem", "blockquote"].includes(node.type)
        ) {
          lines.push("\n");
        }
      }
    }
    walk(doc);
    return lines.join("").trim();
  } catch {
    return raw;
  }
}

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  const queryClient = useQueryClient();

  const { data: progressData } = useQuery<{
    completedLessonIds: string[];
    totalLessons: number;
    completedCount: number;
    percent: number;
  }>({
    queryKey: ["lesson-progress", courseId],
    queryFn: () => fetchData(`/enrollments/progress/course/${courseId}`),
    enabled: !!courseId,
  });

  const completedSet = new Set(progressData?.completedLessonIds ?? []);

  const toggleMutation = useMutation({
    mutationFn: (lessonId: string) =>
      postData<{ completed: boolean }>(`/enrollments/progress/${lessonId}`, {}),
    onMutate: async (lessonId) => {
      await queryClient.cancelQueries({
        queryKey: ["lesson-progress", courseId],
      });
      const prev = queryClient.getQueryData<{
        completedLessonIds: string[];
        totalLessons: number;
        completedCount: number;
        percent: number;
      }>(["lesson-progress", courseId]);
      if (prev) {
        const wasCompleted = prev.completedLessonIds.includes(lessonId);
        const newIds = wasCompleted
          ? prev.completedLessonIds.filter((id) => id !== lessonId)
          : [...prev.completedLessonIds, lessonId];
        queryClient.setQueryData(["lesson-progress", courseId], {
          ...prev,
          completedLessonIds: newIds,
          completedCount: newIds.length,
          percent:
            prev.totalLessons > 0
              ? Math.round((newIds.length / prev.totalLessons) * 100)
              : 0,
        });
      }
      return { prev };
    },
    onError: (_err, _lessonId, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(["lesson-progress", courseId], context.prev);
      toast.error("Failed to update progress");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["progress-overview"] });
    },
  });

  useEffect(() => {
    fetchData<Course>(`/enrollments/learn/${courseId}`)
      .then((data) => {
        setCourse(data);
        // Auto-select first lesson
        const first = data.chapters[0]?.lessons[0];
        if (first) setActiveLesson(first);
        // Open all chapters by default
        setOpenChapters(new Set(data.chapters.map((c) => c.id)));
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 403) {
          setError("You are not enrolled in this course.");
        } else {
          setError("Failed to load course.");
        }
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  function selectLesson(lesson: Lesson) {
    setActiveLesson(lesson);
    // Scroll video into view on mobile
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleChapter(id: string) {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-md flex items-center justify-center">
          <IconAlertCircle size={28} className="text-red-500" />
        </div>
        <p className="font-semibold text-lg text-center">
          {error ?? "Course not found"}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
          {error?.includes("not enrolled") && (
            <Button asChild>
              <Link href={`/courses`}>Enroll Now</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const currentIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const notes = extractText(activeLesson?.description ?? null);

  return (
    <div className="flex flex-col overflow-hidden">
      <PageHeader
        description={
          <div className="flex items-center justify-between gap-2">
            {activeLesson && (
              <p className="text-xs text-muted-foreground truncate">
                {activeLesson.title}
              </p>
            )}
            <p className="text-xs text-muted-foreground shrink-0">
              {course.instructor.firstName} {course.instructor.lastName}
            </p>
          </div>
        }
        back
        title={course.title}
      />

      {/* Main area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video + lesson content */}
        <div className="lg:col-span-2 flex-1 overflow-y-auto">
          {/* Video */}
          <Card className="p-0 overflow-hidden border-0 shadow-none">
            {activeLesson?.videoUrl ? (
              <video
                ref={videoRef}
                key={activeLesson.id}
                src={activeLesson.videoUrl}
                controls
                poster={activeLesson.thumbnailUrl ?? undefined}
                autoPlay
                preload="metadata"
              />
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center gap-3">
                <IconBook size={40} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No video for this lesson
                </p>
              </div>
            )}
          </Card>

          {/* Lesson meta */}
          {activeLesson && (
            <div className="mt-8 space-y-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <CardTitle>{activeLesson.title}</CardTitle>
                {formatDuration(activeLesson.duration) && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {formatDuration(activeLesson.duration)}
                  </Badge>
                )}
              </div>

              {/* Prev / Next / Mark Complete */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && selectLesson(prevLesson)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && selectLesson(nextLesson)}
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  variant={
                    completedSet.has(activeLesson.id) ? "default" : "outline"
                  }
                  className={cn(
                    "ml-auto",
                    completedSet.has(activeLesson.id)
                      ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                      : "",
                  )}
                  onClick={() => toggleMutation.mutate(activeLesson.id)}
                  disabled={toggleMutation.isPending}
                >
                  <IconCheck />
                  {completedSet.has(activeLesson.id)
                    ? "Completed"
                    : "Mark Complete"}
                </Button>
              </div>

              {/* Notes / transcript */}
              {notes && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Lesson Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{notes}</CardDescription>
                  </CardContent>
                </Card>
              )}

              {/* Resources */}
              {activeLesson.resources.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Resources
                  </p>
                  <div className="space-y-2">
                    {activeLesson.resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group"
                      >
                        <IconDownload
                          size={16}
                          className="text-blue-500 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {res.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {res.type.toUpperCase()}
                            {res.size && ` · ${formatBytes(res.size)}`}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: curriculum */}
        <aside className="flex flex-col space-y-4 overflow-y-auto">
          <Card className="">
            <CardHeader className="border-b">
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mt-0.5">
                {allLessons.length} lessons · {course.chapters.length} chapters
              </p>
              {progressData && (
                <p className="text-xs text-muted-foreground mt-1">
                  {progressData.completedCount}/{progressData.totalLessons}{" "}
                  completed ·{" "}
                  <span className="text-blue-500 font-semibold">
                    {progressData.percent}%
                  </span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {course.chapters.map((chapter) => {
                const isOpen = openChapters.has(chapter.id);
                return (
                  <div
                    key={chapter.id}
                    className="border-b border-gray-50 dark:border-gray-800"
                  >
                    <Button
                      variant={"secondary"}
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full justify-start"
                    >
                      <div className="flex w-full items-center justify-between">
                        {chapter.title}
                        {isOpen ? (
                          <IconChevronUp
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                        ) : (
                          <IconChevronDown
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                        )}
                      </div>
                    </Button>

                    {isOpen &&
                      chapter.lessons.map((lesson) => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors",
                              isActive
                                ? "bg-blue-50 dark:bg-blue-950/30 border-r-2 border-blue-600"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800",
                            )}
                          >
                            <div className="shrink-0">
                              {completedSet.has(lesson.id) ? (
                                <IconCheck
                                  size={14}
                                  className="text-green-500"
                                />
                              ) : isActive ? (
                                <IconPlayerPlay
                                  size={14}
                                  className="text-blue-600"
                                />
                              ) : lesson.videoUrl ? (
                                <IconPlayerPlay
                                  size={14}
                                  className="text-gray-400"
                                />
                              ) : (
                                <IconBook size={14} className="text-gray-400" />
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-xs leading-snug flex-1 text-left",
                                isActive
                                  ? "font-bold text-blue-600"
                                  : "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              {lesson.title}
                            </p>
                            {formatDuration(lesson.duration) && (
                              <span className="text-xs text-muted-foreground shrink-0">
                                {formatDuration(lesson.duration)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
