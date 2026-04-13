"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { publicFetch, fetchData, postData, deleteData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlutterwavePayButton } from "@/components/FlutterwavePayButton";
import { toast } from "sonner";
import { cn, formatMoneyInput } from "@/lib/utils";
import {
  IconBook,
  IconClock,
  IconUsers,
  IconChartBar,
  IconWorld,
  IconCheck,
  IconLock,
  IconPlayerPlay,
  IconLoader2,
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconRocket,
  IconCurrencyDollar,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/Loader";
import { NairaIcon } from "@/components/NairaIcon";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isFree: boolean;
  videoUrl: string | null;
}

interface Chapter {
  id: string;
  title: string;
  shortDescription: string | null;
  isFree: boolean;
  order: number;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  thumbnail: string | null;
  previewVideo: string | null;
  level: string;
  language: string;
  pricingType: string;
  price: number | null;
  currency: string | null;
  duration: number;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];
  category: { id: string; name: string; slug: string } | null;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    bio: string | null;
  };
  _count: { enrollments: number; chapters: number };
  chapters: Chapter[];
  avgRating: number | null;
  reviewCount: number;
}

interface ReviewItem {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    username: string;
  };
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
};

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function totalLessons(chapters: Chapter[]) {
  return chapters.reduce((s, c) => s + c.lessons.length, 0);
}

function ChapterRow({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md overflow-hidden">
      <Button
        variant={"secondary"}
        onClick={() => setOpen((v) => !v)}
        className="w-full justify-start"
      >
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm">{chapter.title}</span>
            {chapter.isFree && (
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-200"
              >
                Free preview
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-2">
            <span>{chapter.lessons.length} lessons</span>
            {open ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
          </div>
        </div>
      </Button>

      {open && chapter.lessons.length > 0 && (
        <div className="divide-y divide-gray-50 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-2.5">
                {lesson.isFree ? (
                  <IconPlayerPlay
                    size={14}
                    className="text-blue-500 shrink-0"
                  />
                ) : (
                  <IconLock size={14} className="text-gray-400 shrink-0" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {lesson.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                {formatDuration(lesson.duration)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [myReview, setMyReview] = useState<ReviewItem | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    publicFetch<CourseDetail>(`/public/courses/${slug}`)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // Check enrollment if user is logged in
  useEffect(() => {
    if (!user || !course) return;
    setCheckingEnrollment(true);
    fetchData<{ enrolled: boolean }>(`/enrollments/check/${course.id}`)
      .then((data) => setEnrolled(data.enrolled))
      .catch(() => {})
      .finally(() => setCheckingEnrollment(false));
  }, [user, course]);

  // Fetch reviews
  useEffect(() => {
    if (!course) return;
    publicFetch<{
      reviews: ReviewItem[];
      avgRating: number | null;
      total: number;
    }>(`/reviews/${course.id}`)
      .then((data) => {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setReviewCount(data.total);
        if (user) {
          setMyReview(
            data.reviews.find((r) => r.user.username === user.username) ?? null,
          );
        }
      })
      .catch(() => {});
  }, [course, user]);

  async function handleEnroll() {
    if (!user) {
      toast.error("Please log in to enroll");
      router.push("/login");
      return;
    }
    if (!course) return;

    setEnrolling(true);
    try {
      await postData(`/enrollments/${course.id}/free`, {});
      toast.success("Enrolled successfully! Start learning now.");
      setEnrolled(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg === "Already enrolled") {
        setEnrolled(true);
      } else {
        toast.error(msg ?? "Enrollment failed");
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-20 text-center">
        <p className="text-xl font-bold mb-4">Course not found</p>
        <Button asChild variant="outline">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  const lessons = totalLessons(course.chapters);
  const isFree = course.pricingType === "FREE";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/courses"
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                <IconArrowLeft size={14} /> Courses
              </Link>
              {course.category && (
                <>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-400 text-sm">
                    {course.category.name}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {course.title}
            </h1>

            {course.shortDescription && (
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {course.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300 mb-3">
              <span className="flex items-center gap-1.5">
                <IconChartBar size={15} />
                {LEVEL_LABELS[course.level] ?? course.level}
              </span>
              <span className="flex items-center gap-1.5">
                <IconWorld size={15} />
                {course.language}
              </span>
              <span className="flex items-center gap-1.5">
                <IconBook size={15} />
                {course._count.chapters} chapters · {lessons} lessons
              </span>
              {course.duration > 0 && (
                <span className="flex items-center gap-1.5">
                  <IconClock size={15} />
                  {formatDuration(course.duration)} total
                </span>
              )}
              {course._count.enrollments > 0 && (
                <span className="flex items-center gap-1.5">
                  <IconUsers size={15} />
                  {course._count.enrollments.toLocaleString()} enrolled
                </span>
              )}
              {course.avgRating && (
                <span className="flex items-center gap-1.5">
                  <IconStarFilled size={15} className="text-yellow-400" />
                  {course.avgRating.toFixed(1)}
                  <span className="text-gray-400">({course.reviewCount})</span>
                </span>
              )}
            </div>

            <p className="text-gray-400 text-sm">
              By{" "}
              <span className="text-white font-semibold">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Main content */}
          <div className="flex-1 space-y-4">
            {/* Preview video */}
            {course.previewVideo && (
              <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden">
                <video
                  src={course.previewVideo}
                  controls
                  className="w-full aspect-video"
                  preload="metadata"
                  poster={course.thumbnail ?? undefined}
                />
              </div>
            )}

            {/* What you'll learn */}
            {course.learningOutcomes.length > 0 && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>What You&apos;ll Learn</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.learningOutcomes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <IconCheck
                        size={16}
                        className="text-green-500 mt-0.5 shrink-0"
                      />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.requirements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            {course.chapters.length > 0 && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Curriculum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.chapters.map((chapter) => (
                    <ChapterRow key={chapter.id} chapter={chapter} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Instructor */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                  {course.instructor.image ? (
                    <Image
                      src={course.instructor.image}
                      alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-black text-gray-400">
                      {course.instructor.firstName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  {course.instructor.bio && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader className="flex items-center border-b justify-between mb-4">
                <CardTitle>Student Reviews</CardTitle>
                {avgRating && (
                  <div className="flex items-center gap-1.5">
                    <IconStarFilled className="text-yellow-400" />
                    <span className="font-black text-gray-900 dark:text-white">
                      {avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({reviewCount})
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {/* Write a review (enrolled, logged in, not yet reviewed) */}
                {enrolled && user && !myReview && (
                  <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-5 mb-4">
                    <Label>Leave a Review</Label>
                    {/* Star picker */}
                    <div className="flex gap-1 mt-2.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setReviewRating(s)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          {s <= reviewRating ? (
                            <IconStarFilled
                              size={22}
                              className="text-yellow-400"
                            />
                          ) : (
                            <IconStar size={22} className="text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Share your experience (optional)"
                      maxLength={1000}
                    />
                    <Button
                      className="mt-3"
                      disabled={reviewRating === 0 || submittingReview}
                      onClick={async () => {
                        setSubmittingReview(true);
                        try {
                          const r = await postData<ReviewItem>(
                            `/reviews/${course.id}`,
                            {
                              rating: reviewRating,
                              body: reviewBody || undefined,
                            },
                          );
                          setMyReview(r);
                          setReviews((prev) => [r, ...prev]);
                          setReviewCount((c) => c + 1);
                          setAvgRating(
                            (prev) =>
                              Math.round(
                                (((prev ?? 0) * reviewCount + reviewRating) /
                                  (reviewCount + 1)) *
                                  10,
                              ) / 10,
                          );
                          toast.success("Review submitted!");
                        } catch {
                          toast.error("Failed to submit review");
                        } finally {
                          setSubmittingReview(false);
                        }
                      }}
                    >
                      {submittingReview ? (
                        <Loader text="Submitting..." />
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </div>
                )}

                {/* Own existing review */}
                {myReview && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100 dark:border-blue-900 p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-primary">
                        Your Review
                      </p>
                      <button
                        className="text-xs text-red-500 hover:underline"
                        onClick={async () => {
                          try {
                            await deleteData(`/reviews/${myReview.id}`);
                            setReviews((prev) =>
                              prev.filter((r) => r.id !== myReview.id),
                            );
                            setReviewCount((c) => Math.max(0, c - 1));
                            setMyReview(null);
                            toast.success("Review deleted");
                          } catch {
                            toast.error("Failed to delete review");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) =>
                        s <= myReview.rating ? (
                          <IconStarFilled
                            key={s}
                            size={14}
                            className="text-yellow-400"
                          />
                        ) : (
                          <IconStar
                            key={s}
                            size={14}
                            className="text-gray-300"
                          />
                        ),
                      )}
                    </div>
                    {myReview.body && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {myReview.body}
                      </p>
                    )}
                  </div>
                )}

                {/* All other reviews */}
                {reviews.filter((r) => r.id !== myReview?.id).length === 0 &&
                !myReview ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. {enrolled ? "Be the first to review!" : ""}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reviews
                      .filter((r) => r.id !== myReview?.id)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-black text-blue-600 dark:text-blue-300 text-sm shrink-0">
                              {review.user.firstName[0]}
                              {review.user.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-bold text-sm text-gray-900 dark:text-white">
                                  {review.user.firstName} {review.user.lastName}
                                </p>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex gap-0.5 my-1">
                                {[1, 2, 3, 4, 5].map((s) =>
                                  s <= review.rating ? (
                                    <IconStarFilled
                                      key={s}
                                      size={12}
                                      className="text-yellow-400"
                                    />
                                  ) : (
                                    <IconStar
                                      key={s}
                                      size={12}
                                      className="text-gray-300"
                                    />
                                  ),
                                )}
                              </div>
                              {review.body && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {review.body}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sticky enroll card */}
          <aside className="lg:w-80 shrink-0">
            <Card className="sticky top-4">
              {/* Thumbnail */}
              {course.thumbnail && (
                <div className="rounded-md overflow-hidden mb-5 bg-gray-100">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={320}
                    height={180}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}

              <CardContent>
                {/* Price */}
                <div className="mb-5">
                  {isFree ? (
                    <p className="text-2xl font-semibold">Free</p>
                  ) : (
                    <p className="text-2xl font-semibold">
                      {course.currency === "NGN" ? <NairaIcon /> : "$"}
                      {formatMoneyInput(course.price!)}
                    </p>
                  )}
                </div>

                {/* CTA */}
                {checkingEnrollment ? (
                  <Button className="w-full" disabled>
                    <IconLoader2 className="animate-spin" />
                  </Button>
                ) : enrolled ? (
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/learn/${course.id}`)}
                  >
                    <IconPlayerPlay /> Continue Learning
                  </Button>
                ) : isFree ? (
                  <Button
                    className="w-full"
                    disabled={enrolling}
                    onClick={handleEnroll}
                  >
                    {enrolling ? (
                      <IconLoader2 className="animate-spin" />
                    ) : (
                      <>
                        <IconRocket /> Enroll for Free
                      </>
                    )}
                  </Button>
                ) : user ? (
                  <FlutterwavePayButton
                    courseId={course.id}
                    courseTitle={course.title}
                    price={course.price ?? 0}
                    currency={course.currency ?? "NGN"}
                    user={{
                      email: user.email,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      phoneNumber: user.phoneNumber,
                    }}
                    onSuccess={() => setEnrolled(true)}
                    className="w-full gap-2"
                  />
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={() => router.push("/login")}
                  >
                    <NairaIcon /> Buy Now
                  </Button>
                )}

                {!user && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    <Link
                      href="/login"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Log in
                    </Link>{" "}
                    to enroll
                  </p>
                )}

                {/* Course includes */}
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    This course includes
                  </p>
                  {[
                    {
                      icon: IconBook,
                      label: `${course._count.chapters} chapters · ${lessons} lessons`,
                    },
                    ...(course.duration > 0
                      ? [
                          {
                            icon: IconClock,
                            label: `${formatDuration(course.duration)} of video content`,
                          },
                        ]
                      : []),
                    { icon: IconDownload, label: "Downloadable resources" },
                    { icon: IconClock, label: "Lifetime access" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <Icon
                        size={15}
                        className="text-muted-foreground shrink-0"
                      />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Tags */}
                {course.tags.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
