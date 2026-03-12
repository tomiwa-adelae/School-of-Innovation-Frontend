"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatDate, formatMoneyInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { postData, deleteData } from "@/lib/api";
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
  IconArrowLeft,
  IconBook,
  IconCheck,
  IconX,
  IconLoader2,
  IconClock,
  IconUser,
  IconChartBar,
  IconCurrencyDollar,
  IconWorld,
  IconTag,
  IconVideo,
  IconLock,
  IconEye,
  IconChevronDown,
  IconArchive,
  IconUsers,
  IconCalendar,
  IconCircleCheck,
  IconFileDownload,
  IconPlayerPlay,
  IconFileText,
  IconSearch,
  IconUserPlus,
  IconPencil,
  IconTrash,
  IconShieldCheck,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Loader } from "@/components/Loader";

// ─── Types ───────────────────────────────────────────────────────────────────

type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";

interface Lesson {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  duration: number;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  isFree: boolean;
  isPublished: boolean;
  isDownloadable: boolean;
  resources?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}

interface Chapter {
  id: string;
  title: string;
  shortDescription: string | null;
  isFree: boolean;
  isPublished: boolean;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  thumbnail: string | null;
  previewVideo: string | null;
  level: string;
  language: string;
  status: CourseStatus;
  pricingType: string;
  price: number | null;
  currency: string | null;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];
  duration: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string; icon?: string } | null;
  chapters: Chapter[];
  instructorId: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Extract readable text from TipTap JSON string */
function extractTipTapText(raw: string | null): string {
  if (!raw) return "";
  try {
    const doc = JSON.parse(raw);
    const lines: string[] = [];
    function walk(node: any) {
      if (node.type === "text") {
        lines.push(node.text ?? "");
      } else if (node.type === "hardBreak") {
        lines.push("\n");
      } else if (Array.isArray(node.content)) {
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

const LEVEL_LABELS: Record<string, string> = {
  ALL_LEVELS: "All Levels",
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  PUBLISHED: {
    label: "Published",
    className:
      "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  ARCHIVED: {
    label: "Archived",
    className:
      "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  },
};

// ─── Enrollment types ─────────────────────────────────────────────────────────

interface EnrollmentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  phoneNumber: string | null;
}

interface Enrollment {
  id: string;
  createdAt: string;
  paidAt: string | null;
  amountPaid: number | null;
  currency: string | null;
  flwTransactionId: string | null;
  manuallyEnrolled: boolean;
  manuallyEnrolledBy: string | null;
  adminNotes: string | null;
  paymentVerified: boolean;
  user: EnrollmentUser;
}

// ─── Edit Enrollment Sheet ────────────────────────────────────────────────────

function EditEnrollmentSheet({
  enrollment,
  onClose,
  onSaved,
}: {
  enrollment: Enrollment | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [paymentVerified, setPaymentVerified] = useState(
    enrollment?.paymentVerified ?? false,
  );
  const [adminNotes, setAdminNotes] = useState(enrollment?.adminNotes ?? "");
  const [flwTxId, setFlwTxId] = useState(enrollment?.flwTransactionId ?? "");
  const [amountPaid, setAmountPaid] = useState(
    enrollment?.amountPaid?.toString() ?? "",
  );
  const [saving, setSaving] = useState(false);

  // Sync when enrollment changes
  useEffect(() => {
    if (!enrollment) return;
    setPaymentVerified(enrollment.paymentVerified);
    setAdminNotes(enrollment.adminNotes ?? "");
    setFlwTxId(enrollment.flwTransactionId ?? "");
    setAmountPaid(enrollment.amountPaid?.toString() ?? "");
  }, [enrollment?.id]);

  async function handleSave() {
    if (!enrollment) return;
    setSaving(true);
    try {
      await updateData(`/enrollments/admin/${enrollment.id}`, {
        paymentVerified,
        adminNotes: adminNotes || undefined,
        flwTransactionId: flwTxId || undefined,
        amountPaid: amountPaid ? parseFloat(amountPaid) : undefined,
      });
      toast.success("Enrollment updated");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to update enrollment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={!!enrollment} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto py-5 pb-10">
        <SheetHeader className="border-b">
          <SheetTitle>Edit Enrollment</SheetTitle>
          {enrollment && (
            <SheetDescription>
              {enrollment.user.firstName} {enrollment.user.lastName} —{" "}
              {enrollment.user.email}
            </SheetDescription>
          )}
        </SheetHeader>

        {enrollment && (
          <div className="container space-y-4">
            {/* Payment status banner */}
            <div
              className={cn(
                "rounded-md p-4 flex items-start gap-3",
                enrollment.paymentVerified
                  ? "bg-green-50 dark:bg-green-950/30"
                  : "bg-amber-50 dark:bg-amber-950/30",
              )}
            >
              {enrollment.paymentVerified ? (
                <IconShieldCheck
                  size={18}
                  className="text-green-600 mt-0.5 shrink-0"
                />
              ) : (
                <IconAlertCircle
                  size={18}
                  className="text-amber-600 mt-0.5 shrink-0"
                />
              )}
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    enrollment.paymentVerified
                      ? "text-green-700 dark:text-green-400"
                      : "text-amber-700 dark:text-amber-400",
                  )}
                >
                  {enrollment.paymentVerified
                    ? "Payment verified"
                    : "Payment not verified"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {enrollment.manuallyEnrolled
                    ? "Manually enrolled by admin"
                    : enrollment.paidAt
                      ? `Paid on ${new Date(enrollment.paidAt).toLocaleDateString()}`
                      : "No payment record"}
                </p>
              </div>
            </div>

            {/* Verify payment toggle */}
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Mark payment as verified
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Grants full course access regardless of payment status
                  </p>
                </div>
                <button
                  onClick={() => setPaymentVerified((v) => !v)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors shrink-0",
                    paymentVerified
                      ? "bg-green-600"
                      : "bg-gray-200 dark:bg-gray-700",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                      paymentVerified && "translate-x-5",
                    )}
                  />
                </button>
              </CardContent>
            </Card>

            {/* FLW Transaction ID */}
            <div className="space-y-1.5">
              <Label>Flutterwave Transaction ID</Label>
              <Input
                value={flwTxId}
                onChange={(e) => setFlwTxId(e.target.value)}
                placeholder="e.g. 123456789"
              />
              <p className="text-xs text-muted-foreground">
                Used to cross-check with Flutterwave dashboard
              </p>
            </div>

            {/* Amount paid */}
            <div className="space-y-1.5">
              <Label>Amount Paid</Label>
              <Input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="e.g. 25000"
              />
            </div>

            {/* Admin notes */}
            <div className="space-y-1.5">
              <Label>Support Notes (internal)</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Student reported payment was debited but enrollment failed. Manually verified via FLW dashboard TXN#..."
              />
            </div>

            <Button className="w-full" disabled={saving} onClick={handleSave}>
              {saving ? <Loader /> : null}
              Save Changes
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Manual Enroll Dialog ─────────────────────────────────────────────────────

function ManualEnrollDialog({
  courseId,
  open,
  onClose,
  onEnrolled,
}: {
  courseId: string;
  open: boolean;
  onClose: () => void;
  onEnrolled: () => void;
}) {
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setEmail("");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await postData(`/enrollments/admin/manual/${courseId}`, {
        userEmail: email.trim(),
        notes: notes.trim() || undefined,
      });
      toast.success(`${email} enrolled successfully`);
      reset();
      onClose();
      onEnrolled();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to enroll user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manually Enroll a Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Student Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              The user must already have an account on the platform.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Support Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Manual enrollment — payment confirmed via bank statement (ref: ...)"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? <Loader /> : "Enroll Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Enrollment Sidebar Card (count only) ─────────────────────────────────────

function EnrollmentSidebarCard({ courseId }: { courseId: string }) {
  const { data } = useQuery<{ enrollments: Enrollment[]; total: number }>({
    queryKey: ["admin-enrollments", courseId, ""],
    queryFn: () => fetchData(`/enrollments/admin/list?courseId=${courseId}`),
  });

  const total = data?.total ?? null;
  const verified =
    data?.enrollments.filter((e) => e.paymentVerified).length ?? null;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Enrolled Students</CardTitle>
      </CardHeader>
      <CardContent>
        {total !== null && (
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <IconShieldCheck size={12} className="text-green-500" />{" "}
                Verified payments
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {verified}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <IconAlertCircle size={12} className="text-amber-500" />{" "}
                Unverified
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(total ?? 0) - (verified ?? 0)}
              </span>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          Manage enrollments in the section below ↓
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Enrolled Students Section ────────────────────────────────────────────────

function EnrolledStudentsSection({ courseId }: { courseId: string }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [manualEnrollOpen, setManualEnrollOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null,
  );
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const params = new URLSearchParams({ courseId });
  if (debouncedSearch) params.set("search", debouncedSearch);

  const { data, isLoading, refetch } = useQuery<{
    enrollments: Enrollment[];
    total: number;
  }>({
    queryKey: ["admin-enrollments", courseId, debouncedSearch],
    queryFn: () => fetchData(`/enrollments/admin/list?${params.toString()}`),
  });

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["admin-enrollments", courseId],
    });
  }

  async function handleRevoke(enrollment: Enrollment) {
    if (
      !window.confirm(
        `Remove ${enrollment.user.firstName} ${enrollment.user.lastName}'s access to this course?`,
      )
    )
      return;
    setRevokingId(enrollment.id);
    try {
      await deleteData(`/enrollments/admin/${enrollment.id}`);
      toast.success("Enrollment revoked");
      invalidate();
    } catch {
      toast.error("Failed to revoke enrollment");
    } finally {
      setRevokingId(null);
    }
  }

  const enrollments = data?.enrollments ?? [];
  const total = data?.total ?? 0;

  return (
    <Card>
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b gap-3">
        <div>
          <h2>Enrolled Students</h2>
          {total > 0 && (
            <CardDescription className="mt-0.5">
              {total} student{total !== 1 ? "s" : ""} enrolled
            </CardDescription>
          )}
        </div>
        <div className="flex items-center w-full sm:w-auto gap-2">
          <Button
            className="flex-1"
            size="sm"
            variant="outline"
            onClick={() => refetch()}
          >
            <IconRefresh size={14} />
          </Button>
          <Button
            className="flex-1"
            size="sm"
            onClick={() => setManualEnrollOpen(true)}
          >
            <IconUserPlus size={14} />
            Manual Enroll
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <InputGroup>
            <InputGroupInput placeholder="Search by name or email..." />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-mdl flex items-center justify-center mx-auto mb-3">
              <IconUsers size={22} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm">
              {debouncedSearch
                ? "No students match your search"
                : "No students enrolled yet"}
            </p>
            {!debouncedSearch && (
              <p className="text-xs text-muted-foreground mt-1">
                Use "Manual Enroll" to grant access to a student.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {enrollments.map((enrollment) => {
              const name = `${enrollment.user.firstName} ${enrollment.user.lastName}`;
              return (
                <div
                  key={enrollment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-md border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0 font-black text-sm text-primary">
                      {enrollment.user.firstName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {enrollment.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Badges & meta */}
                  <div className="flex flex-wrap items-center gap-2 sm:ml-2 shrink-0">
                    {/* Payment status */}
                    {enrollment.paymentVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
                        <IconShieldCheck size={10} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                        <IconAlertCircle size={11} /> Unverified
                      </span>
                    )}

                    {/* Manual badge */}
                    {enrollment.manuallyEnrolled && (
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">
                        Manual
                      </span>
                    )}

                    {/* Amount */}
                    {enrollment.amountPaid && (
                      <span className="text-xs text-muted-foreground">
                        <NairaIcon />
                        {formatMoneyInput(enrollment.amountPaid)}
                      </span>
                    )}

                    {/* Enrolled date */}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(enrollment.createdAt)}
                    </span>

                    {/* Notes indicator */}
                    {enrollment.adminNotes && (
                      <span
                        title={enrollment.adminNotes}
                        className="cursor-help text-xs text-primary"
                      >
                        <IconFileText size={13} />
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Edit enrollment"
                      className="flex-1"
                      onClick={() => setEditingEnrollment(enrollment)}
                    >
                      <IconPencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive flex-1 hover:text-destructive hover:bg-destructive/5"
                      title="Revoke access"
                      disabled={revokingId === enrollment.id}
                      onClick={() => handleRevoke(enrollment)}
                    >
                      {revokingId === enrollment.id ? (
                        <IconLoader2 size={14} className="animate-spin" />
                      ) : (
                        <IconTrash size={14} />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Manual Enroll Dialog */}
        <ManualEnrollDialog
          courseId={courseId}
          open={manualEnrollOpen}
          onClose={() => setManualEnrollOpen(false)}
          onEnrolled={invalidate}
        />

        {/* Edit Enrollment Sheet */}
        <EditEnrollmentSheet
          enrollment={editingEnrollment}
          onClose={() => setEditingEnrollment(null)}
          onSaved={invalidate}
        />
      </CardContent>
    </Card>
  );
}

// ─── Lesson Preview Sheet ─────────────────────────────────────────────────────

function LessonPreviewSheet({
  lesson,
  onClose,
}: {
  lesson: Lesson | null;
  onClose: () => void;
}) {
  const transcript = extractTipTapText(lesson?.description ?? null);

  return (
    <Sheet open={!!lesson} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto pt-5 pb-10"
      >
        {lesson && (
          <>
            <SheetHeader className="mb-4 border-b">
              <SheetTitle>{lesson.title}</SheetTitle>
              {/* Badges */}
              <div className="flex flex-wrap gap-1 pt-1">
                {lesson.isFree ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                    <IconEye size={11} /> Free Preview
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <IconLock size={11} /> Enrolled Only
                  </span>
                )}
                {lesson.isDownloadable && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/30 text-primary dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <IconFileDownload size={11} /> Downloadable
                  </span>
                )}
                {lesson.duration > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                    <IconClock size={11} /> {formatDuration(lesson.duration)}
                  </span>
                )}
              </div>
            </SheetHeader>

            <div className="container space-y-4">
              {/* Video Player */}
              {lesson.videoUrl ? (
                <div className="rounded-md overflow-hidden">
                  <video
                    src={lesson.videoUrl}
                    controls
                    className="w-full aspect-video"
                    preload="metadata"
                    poster={lesson.thumbnailUrl ?? undefined}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                    <IconVideo size={22} className="text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-muted-foreground text-sm">
                    No video uploaded
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The instructor hasn&apos;t uploaded a video for this lesson
                    yet.
                  </p>
                </div>
              )}

              {/* Short description */}
              {lesson.shortDescription && (
                <Card>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {lesson.shortDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Notes / Transcript */}
              {transcript && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-1">
                      <IconFileText
                        size={15}
                        className="text-muted-foreground"
                      />
                      <p>Notes / Transcript</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {transcript}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Downloadable Resources */}
              {lesson.resources && lesson.resources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <IconFileDownload
                      size={15}
                      className="text-muted-foreground"
                    />
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Resources ({lesson.resources.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {lesson.resources.map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                          <IconFileDownload
                            size={15}
                            className="text-primary"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                            {r.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.type.toUpperCase()}
                            {r.size ? ` · ${formatFileSize(r.size)}` : ""}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* No content at all */}
              {!lesson.videoUrl &&
                !transcript &&
                (!lesson.resources || lesson.resources.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    This lesson has no content yet.
                  </div>
                )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Collapsible Chapter Row ──────────────────────────────────────────────────

function ChapterRow({
  chapter,
  index,
  onSelectLesson,
}: {
  chapter: Chapter;
  index: number;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const [open, setOpen] = useState(false);
  const totalDuration = chapter.lessons.reduce((s, l) => s + l.duration, 0);
  const hasVideos = chapter.lessons.filter((l) => l.videoUrl).length;

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <span className="text-xs font-bold text-muted-foreground w-6 shrink-0 text-center">
          {index + 1}
        </span>
        <IconChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform shrink-0",
            open ? "rotate-0" : "-rotate-90",
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{chapter.title}</p>
          <p className="text-xs text-muted-foreground">
            {chapter.lessons.length} lesson
            {chapter.lessons.length !== 1 ? "s" : ""}
            {totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
            {` · ${hasVideos} video${hasVideos !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {chapter.isFree && (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-0.5">
              <IconEye size={11} /> Free
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {chapter.lessons.length === 0 ? (
            <div className="px-4 py-4 text-xs text-muted-foreground text-center bg-gray-50/50 dark:bg-gray-900/30">
              No lessons in this chapter
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {chapter.lessons.map((lesson, li) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onSelectLesson(lesson)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-colors text-left group"
                >
                  <span className="text-xs text-muted-foreground w-6 text-center shrink-0">
                    {li + 1}
                  </span>
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      lesson.videoUrl
                        ? "bg-blue-50 dark:bg-blue-950/40 text-primary group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50"
                        : "bg-gray-100 dark:bg-gray-800 text-muted-foreground",
                    )}
                  >
                    {lesson.videoUrl ? (
                      <IconPlayerPlay size={13} />
                    ) : (
                      <IconVideo size={13} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary dark:group-hover:text-primary transition-colors">
                      {lesson.title}
                    </p>
                    {lesson.shortDescription && (
                      <p className="text-xs text-muted-foreground truncate">
                        {lesson.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.duration > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <IconClock size={11} />
                        {formatDuration(lesson.duration)}
                      </span>
                    )}
                    {!lesson.videoUrl && (
                      <span className="text-xs text-amber-500 font-semibold">
                        No video
                      </span>
                    )}
                    {lesson.isFree ? (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-0.5">
                        <IconEye size={11} /> Free
                      </span>
                    ) : (
                      <IconLock size={12} className="text-muted-foreground" />
                    )}
                    {lesson.isDownloadable && (
                      <IconFileDownload size={12} className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ActionType = "approve" | "reject" | "archive";

export default function AdminCourseDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const queryClient = useQueryClient();
  const [confirmAction, setConfirmAction] = useState<ActionType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (!user) return null;
  if (user.role !== "ADMINISTRATOR") {
    router.replace("/a/dashboard");
    return null;
  }

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["admin-course", courseId],
    queryFn: () => fetchData(`/admin/courses/${courseId}`),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
    queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
  }

  const approveMutation = useMutation({
    mutationFn: () => updateData(`/admin/courses/${courseId}/approve`, {}),
    onSuccess: () => {
      toast.success("Course approved and published!");
      invalidate();
    },
    onError: () => toast.error("Failed to approve course"),
  });

  const rejectMutation = useMutation({
    mutationFn: () => updateData(`/admin/courses/${courseId}/reject`, {}),
    onSuccess: () => {
      toast.success("Course rejected and moved back to draft");
      invalidate();
    },
    onError: () => toast.error("Failed to reject course"),
  });

  const archiveMutation = useMutation({
    mutationFn: () => updateData(`/admin/courses/${courseId}/archive`, {}),
    onSuccess: () => {
      toast.success("Course archived");
      invalidate();
    },
    onError: () => toast.error("Failed to archive course"),
  });

  const isMutating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    archiveMutation.isPending;

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction === "approve") approveMutation.mutate();
    else if (confirmAction === "reject") rejectMutation.mutate();
    else if (confirmAction === "archive") archiveMutation.mutate();
    setConfirmAction(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <IconLoader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-32">
        <p className="text-muted-foreground mb-4 font-semibold">
          Course not found
        </p>
        <Button asChild variant={"secondary"}>
          <Link href="/a/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[course.status];
  const totalLessons = course.chapters.reduce(
    (s, c) => s + c.lessons.length,
    0,
  );
  const totalDuration =
    course.duration ||
    course.chapters.reduce(
      (t, c) => t + c.lessons.reduce((s, l) => s + (l.duration ?? 0), 0),
      0,
    );
  const freeLessons = course.chapters.reduce(
    (s, c) => s + c.lessons.filter((l) => l.isFree).length,
    0,
  );
  const lessonsWithVideo = course.chapters.reduce(
    (s, c) => s + c.lessons.filter((l) => l.videoUrl).length,
    0,
  );

  const ACTION_CONFIRM_TEXT: Record<
    ActionType,
    { title: string; body: string; cta: string; cls: string }
  > = {
    approve: {
      title: "Approve & Publish Course?",
      body: `"${course.title}" will go live on the platform and students will be able to enrol.`,
      cta: "Approve & Publish",
      cls: "bg-green-600 hover:bg-green-700",
    },
    reject: {
      title: "Reject Course?",
      body: `"${course.title}" will be moved back to Draft. The instructor will need to make changes and resubmit.`,
      cta: "Reject",
      cls: "bg-destructive hover:bg-destructive/90",
    },
    archive: {
      title: "Archive Course?",
      body: `"${course.title}" will be hidden from students. The instructor can resubmit it later.`,
      cta: "Archive",
      cls: "bg-destructive hover:bg-destructive/90",
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader back title={course.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* ── LEFT: Course Content ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hero card */}
          <Card className="p-0 overflow-hidden">
            {course.thumbnail && (
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge
                    variant="outline"
                    className={cn("text-xs mb-2", statusCfg.className)}
                  >
                    {statusCfg.label}
                  </Badge>
                  <h1 className="text-2xl font-bold text-white">
                    {course.title}
                  </h1>
                </div>
              </div>
            )}
            <CardContent className={cn("", !course.thumbnail && "pt-6")}>
              {!course.thumbnail && (
                <>
                  <Badge
                    variant="outline"
                    className={cn("text-xs mb-3", statusCfg.className)}
                  >
                    {statusCfg.label}
                  </Badge>
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                </>
              )}
              {course.shortDescription && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {course.shortDescription}
                </p>
              )}

              {/* Preview video */}
              {course.previewVideo && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Preview Video
                  </p>
                  <Card className="p-0 overflow-hidden aspect-video">
                    <video
                      src={course.previewVideo}
                      controls
                      preload="metadata"
                      poster={course.thumbnail ?? undefined}
                    />
                  </Card>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2 py-8 ">
                {[
                  {
                    icon: IconBook,
                    label: "Chapters",
                    value: course.chapters.length,
                  },
                  { icon: IconVideo, label: "Lessons", value: totalLessons },
                  {
                    icon: IconClock,
                    label: "Duration",
                    value: formatDuration(totalDuration),
                  },
                  {
                    icon: IconChartBar,
                    label: "Level",
                    value: LEVEL_LABELS[course.level] ?? course.level,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon
                      size={18}
                      className="text-muted-foreground mx-auto mb-1"
                    />
                    <p className="font-bold text-lg">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course details */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Course Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconCurrencyDollar size={15} />
                  <span>Pricing:</span>
                  <span className="font-medium text-foreground">
                    {course.pricingType === "FREE" ? (
                      "Free"
                    ) : course.pricingType === "PAID" ? (
                      <>
                        <NairaIcon />
                        {formatMoneyInput(course.price!)}
                      </>
                    ) : (
                      "Subscription"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconWorld size={15} />
                  <span>Language:</span>
                  <span className="font-medium text-foreground">
                    {course.language}
                  </span>
                </div>
                {course.category && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconTag size={15} />
                    <span>Category:</span>
                    <span className="font-medium text-foreground">
                      {course.category.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconCalendar size={15} />
                  <span>Submitted:</span>
                  <span className="font-medium text-foreground">
                    {formatDate(course.updatedAt)}
                  </span>
                </div>
                {course.publishedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconCircleCheck size={15} />
                    <span>Published:</span>
                    <span className="font-medium text-foreground">
                      {formatDate(course.publishedAt)}
                    </span>
                  </div>
                )}
              </div>
              <Separator className="my-6" />
              {course.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {course.learningOutcomes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    What Students Will Learn
                  </p>
                  <ul className="space-y-1.5">
                    {course.learningOutcomes.map((o, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <IconCircleCheck
                          size={15}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="my-6" />

              {course.requirements.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Requirements
                  </p>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    {course.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="my-6" />

              {course.targetAudience.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Who This Is For
                  </p>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    {course.targetAudience.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Curriculum — clickable lessons */}
          {course.chapters.length > 0 && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Curriculum</CardTitle>
                <CardDescription>
                  Click any lesson to preview its content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.chapters.map((chapter, i) => (
                  <ChapterRow
                    key={chapter.id}
                    chapter={chapter}
                    index={i}
                    onSelectLesson={setSelectedLesson}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Enrolled Students (full management) */}
          <EnrolledStudentsSection courseId={courseId} />
        </div>

        {/* ── RIGHT: Sidebar ───────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Admin Actions */}
          <Card className="sticky top-4">
            <CardHeader className="border-b">
              <CardTitle> Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.status === "UNDER_REVIEW" && (
                  <>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={isMutating}
                      onClick={() => setConfirmAction("approve")}
                    >
                      {approveMutation.isPending ? (
                        <Loader />
                      ) : (
                        <IconCheck size={16} />
                      )}
                      Approve & Publish
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
                      disabled={isMutating}
                      onClick={() => setConfirmAction("reject")}
                    >
                      {rejectMutation.isPending ? (
                        <Loader />
                      ) : (
                        <IconX size={16} />
                      )}
                      Reject (Move to Draft)
                    </Button>
                  </>
                )}

                {course.status === "PUBLISHED" && (
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
                    disabled={isMutating}
                    onClick={() => setConfirmAction("archive")}
                  >
                    {archiveMutation.isPending ? (
                      <Loader />
                    ) : (
                      <IconArchive size={16} />
                    )}
                    Archive Course
                  </Button>
                )}

                {course.status === "ARCHIVED" && (
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-2xl font-bold gap-2"
                    disabled={isMutating}
                    onClick={() => setConfirmAction("reject")}
                  >
                    {rejectMutation.isPending ? (
                      <IconLoader2 size={16} className="animate-spin" />
                    ) : (
                      <IconBook size={16} />
                    )}
                    Move Back to Draft
                  </Button>
                )}

                {course.status === "DRAFT" && (
                  <div className="text-center py-3">
                    <p className="text-xs text-muted-foreground">
                      This course is in draft. The instructor hasn&apos;t
                      submitted it for review yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-muted-foreground text-center">
                  Last updated {formatDate(course.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instructor */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/40 rounded-xl flex items-center justify-center shrink-0">
                  <IconUser size={18} className="text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {course.instructor.email}
                  </p>
                </div>
              </div>
              <Button size="sm" asChild className="mt-3" variant="link">
                <Link href="/a/instructors">View instructor management</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Enrolled Students — sidebar quick stats */}
          <EnrollmentSidebarCard courseId={courseId} />

          {/* Content breakdown */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Content Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                {
                  label: "Chapters",
                  value: course.chapters.length,
                  icon: IconBook,
                },
                {
                  label: "Total Lessons",
                  value: totalLessons,
                  icon: IconVideo,
                },
                {
                  label: "Lessons with Video",
                  value: `${lessonsWithVideo} / ${totalLessons}`,
                  icon: IconPlayerPlay,
                },
                { label: "Free Lessons", value: freeLessons, icon: IconEye },
                {
                  label: "Total Duration",
                  value: formatDuration(totalDuration),
                  icon: IconClock,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Icon size={13} />
                    {label}
                  </span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson preview sheet */}
      <LessonPreviewSheet
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />

      {/* Confirm dialog */}
      {confirmAction && (
        <AlertDialog open onOpenChange={(v) => !v && setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {ACTION_CONFIRM_TEXT[confirmAction].title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {ACTION_CONFIRM_TEXT[confirmAction].body}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={ACTION_CONFIRM_TEXT[confirmAction].cls}
              >
                {ACTION_CONFIRM_TEXT[confirmAction].cta}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
