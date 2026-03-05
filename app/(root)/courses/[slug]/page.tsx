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
import { cn } from "@/lib/utils";
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
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {chapter.title}
          </span>
          {chapter.isFree && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              Free preview
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-2">
          <span>{chapter.lessons.length} lessons</span>
          {open ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
        </div>
      </button>

      {open && chapter.lessons.length > 0 && (
        <div className="divide-y divide-gray-50 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-2.5">
                {lesson.isFree ? (
                  <IconPlayerPlay size={14} className="text-blue-500 shrink-0" />
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
    publicFetch<{ reviews: ReviewItem[]; avgRating: number | null; total: number }>(
      `/reviews/${course.id}`
    )
      .then((data) => {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setReviewCount(data.total);
        if (user) {
          setMyReview(
            data.reviews.find((r) => r.user.username === user.username) ?? null
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
        <p className="text-xl font-black text-gray-900 dark:text-white mb-4">
          Course not found
        </p>
        <Link href="/courses">
          <Button variant="outline" className="rounded-xl">
            <IconArrowLeft size={16} className="mr-2" /> Browse Courses
          </Button>
        </Link>
      </div>
    );
  }

  const lessons = totalLessons(course.chapters);
  const isFree = course.pricingType === "FREE";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
                  <span className="text-gray-400 text-sm">{course.category.name}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              {course.title}
            </h1>

            {course.shortDescription && (
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {course.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300 mb-6">
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
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Preview video */}
            {course.previewVideo && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
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
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4">
                  What You&apos;ll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.learningOutcomes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <IconCheck
                        size={16}
                        className="text-green-500 mt-0.5 shrink-0"
                      />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum */}
            {course.chapters.length > 0 && (
              <div>
                <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4">
                  Curriculum
                </h2>
                <div className="space-y-2">
                  {course.chapters.map((chapter) => (
                    <ChapterRow key={chapter.id} chapter={chapter} />
                  ))}
                </div>
              </div>
            )}

            {/* Instructor */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4">
                Your Instructor
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
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
                  <p className="font-black text-gray-900 dark:text-white">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  {course.instructor.bio && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900 dark:text-white text-lg">
                  Student Reviews
                </h2>
                {avgRating && (
                  <div className="flex items-center gap-1.5">
                    <IconStarFilled size={18} className="text-yellow-400" />
                    <span className="font-black text-gray-900 dark:text-white">
                      {avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({reviewCount})
                    </span>
                  </div>
                )}
              </div>

              {/* Write a review (enrolled, logged in, not yet reviewed) */}
              {enrolled && user && !myReview && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
                  <p className="font-bold text-sm text-gray-900 dark:text-white mb-3">
                    Leave a Review
                  </p>
                  {/* Star picker */}
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        {s <= reviewRating ? (
                          <IconStarFilled size={22} className="text-yellow-400" />
                        ) : (
                          <IconStar size={22} className="text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Share your experience (optional)"
                    maxLength={1000}
                    rows={3}
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    size="sm"
                    className="mt-3 rounded-xl"
                    disabled={reviewRating === 0 || submittingReview}
                    onClick={async () => {
                      setSubmittingReview(true);
                      try {
                        const r = await postData<ReviewItem>(
                          `/reviews/${course.id}`,
                          {
                            rating: reviewRating,
                            body: reviewBody || undefined,
                          }
                        );
                        setMyReview(r);
                        setReviews((prev) => [r, ...prev]);
                        setReviewCount((c) => c + 1);
                        setAvgRating(
                          (prev) =>
                            Math.round(
                              (((prev ?? 0) * (reviewCount) + reviewRating) /
                                (reviewCount + 1)) *
                                10
                            ) / 10
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
                      <IconLoader2 size={14} className="animate-spin" />
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              )}

              {/* Own existing review */}
              {myReview && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-3xl border border-blue-100 dark:border-blue-900 p-5 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-blue-600">
                      Your Review
                    </p>
                    <button
                      className="text-xs text-red-500 hover:underline"
                      onClick={async () => {
                        try {
                          await deleteData(`/reviews/${myReview.id}`);
                          setReviews((prev) =>
                            prev.filter((r) => r.id !== myReview.id)
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
                        <IconStar key={s} size={14} className="text-gray-300" />
                      )
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
                  No reviews yet.{" "}
                  {enrolled ? "Be the first to review!" : ""}
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews
                    .filter((r) => r.id !== myReview?.id)
                    .map((review) => (
                      <div
                        key={review.id}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
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
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
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
                                )
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
            </div>
          </div>

          {/* Sticky enroll card */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sticky top-4">
              {/* Thumbnail */}
              {course.thumbnail && (
                <div className="rounded-2xl overflow-hidden mb-5 bg-gray-100">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={320}
                    height={180}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}

              {/* Price */}
              <div className="mb-5">
                {isFree ? (
                  <p className="text-3xl font-black text-gray-900 dark:text-white">Free</p>
                ) : (
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    {course.currency ?? "$"}{course.price}
                  </p>
                )}
              </div>

              {/* CTA */}
              {checkingEnrollment ? (
                <Button className="w-full h-12 rounded-2xl font-black" disabled>
                  <IconLoader2 size={18} className="animate-spin" />
                </Button>
              ) : enrolled ? (
                <Button
                  className="w-full h-12 rounded-2xl font-black bg-green-600 hover:bg-green-700 text-white gap-2"
                  onClick={() => router.push(`/learn/${course.id}`)}
                >
                  <IconPlayerPlay size={18} /> Continue Learning
                </Button>
              ) : isFree ? (
                <Button
                  className="w-full h-12 rounded-2xl font-black gap-2"
                  disabled={enrolling}
                  onClick={handleEnroll}
                >
                  {enrolling ? (
                    <IconLoader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <IconRocket size={18} /> Enroll for Free
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
                  className="w-full h-12 rounded-2xl font-black gap-2"
                />
              ) : (
                <Button
                  className="w-full h-12 rounded-2xl font-black gap-2"
                  onClick={() => router.push("/login")}
                >
                  <IconCurrencyDollar size={18} /> Buy Now
                </Button>
              )}

              {!user && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  <Link href="/login" className="text-blue-600 font-bold hover:underline">
                    Log in
                  </Link>{" "}
                  to enroll
                </p>
              )}

              {/* Course includes */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  This course includes
                </p>
                {[
                  { icon: IconBook, label: `${course._count.chapters} chapters · ${lessons} lessons` },
                  ...(course.duration > 0 ? [{ icon: IconClock, label: `${formatDuration(course.duration)} of video content` }] : []),
                  { icon: IconDownload, label: "Downloadable resources" },
                  { icon: IconClock, label: "Lifetime access" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <Icon size={15} className="text-muted-foreground shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Tags */}
              {course.tags.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
