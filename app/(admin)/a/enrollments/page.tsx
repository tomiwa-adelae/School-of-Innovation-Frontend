"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData, deleteData } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  IconSearch,
  IconLoader2,
  IconUsers,
  IconShieldCheck,
  IconAlertCircle,
  IconPencil,
  IconTrash,
  IconRefresh,
  IconArrowLeft,
  IconFileText,
  IconFilter,
  IconX,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnrollmentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  adminNotes: string | null;
  paymentVerified: boolean;
  user: EnrollmentUser;
  course: {
    id: string;
    title: string;
    slug: string;
    pricingType: string;
    price: number | null;
    currency: string | null;
  };
}

// ─── Edit Sheet ───────────────────────────────────────────────────────────────

function EditEnrollmentSheet({
  enrollment,
  onClose,
  onSaved,
}: {
  enrollment: Enrollment | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [flwTxId, setFlwTxId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [saving, setSaving] = useState(false);

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
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Enrollment</SheetTitle>
          {enrollment && (
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {enrollment.user.firstName} {enrollment.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {enrollment.user.email}
              </p>
              <p className="text-xs text-muted-foreground font-medium truncate">
                Course: {enrollment.course.title}
              </p>
            </div>
          )}
        </SheetHeader>

        {enrollment && (
          <div className="space-y-5">
            {/* Status banner */}
            <div
              className={cn(
                "rounded-2xl p-4 flex items-start gap-3",
                enrollment.paymentVerified
                  ? "bg-green-50 dark:bg-green-950/30"
                  : "bg-amber-50 dark:bg-amber-950/30"
              )}
            >
              {enrollment.paymentVerified ? (
                <IconShieldCheck size={18} className="text-green-600 mt-0.5 shrink-0" />
              ) : (
                <IconAlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              )}
              <div>
                <p
                  className={cn(
                    "text-sm font-bold",
                    enrollment.paymentVerified
                      ? "text-green-700 dark:text-green-400"
                      : "text-amber-700 dark:text-amber-400"
                  )}
                >
                  {enrollment.paymentVerified ? "Payment verified" : "Payment not verified"}
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

            {/* Verify toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Mark as payment verified
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Grants access regardless of automatic payment status
                </p>
              </div>
              <button
                onClick={() => setPaymentVerified((v) => !v)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  paymentVerified ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    paymentVerified && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* FLW TXN ID */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Flutterwave Transaction ID
              </Label>
              <Input
                value={flwTxId}
                onChange={(e) => setFlwTxId(e.target.value)}
                placeholder="e.g. 7653849201"
                className="rounded-xl"
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Amount Paid
              </Label>
              <Input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="e.g. 25000"
                className="rounded-xl"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Support Notes (internal only)
              </Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Student confirmed payment via bank statement. Manually verified TXN# on FLW dashboard."
                className="rounded-xl min-h-[100px] text-sm"
              />
            </div>

            <Button
              className="w-full h-11 rounded-2xl font-black"
              disabled={saving}
              onClick={handleSave}
            >
              {saving && <IconLoader2 size={15} className="animate-spin mr-2" />}
              Save Changes
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTERS = [
  { label: "All", value: "" },
  { label: "Unverified", value: "unverified" },
  { label: "Verified", value: "verified" },
  { label: "Manual", value: "manual" },
];

export default function AdminEnrollmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  if (!user) return null;
  if (user.role !== "ADMINISTRATOR") {
    router.replace("/a/dashboard");
    return null;
  }

  const params = new URLSearchParams({ limit: "100" });
  if (debouncedSearch) params.set("search", debouncedSearch);

  const { data, isLoading, refetch } = useQuery<{
    enrollments: Enrollment[];
    total: number;
  }>({
    queryKey: ["admin-enrollments-all", debouncedSearch],
    queryFn: () => fetchData(`/enrollments/admin/list?${params.toString()}`),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-enrollments-all"] });
  }

  async function handleRevoke(enrollment: Enrollment) {
    if (
      !window.confirm(
        `Remove ${enrollment.user.firstName} ${enrollment.user.lastName}'s enrollment in "${enrollment.course.title}"?`
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

  const allEnrollments = data?.enrollments ?? [];

  // Client-side filter
  const filtered = allEnrollments.filter((e) => {
    if (filter === "unverified") return !e.paymentVerified;
    if (filter === "verified") return e.paymentVerified && !e.manuallyEnrolled;
    if (filter === "manual") return e.manuallyEnrolled;
    return true;
  });

  const unverifiedCount = allEnrollments.filter((e) => !e.paymentVerified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/a/courses"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Enrollment Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, verify, and manage all student enrollments
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1.5"
          onClick={() => refetch()}
        >
          <IconRefresh size={14} /> Refresh
        </Button>
      </div>

      {/* Stats row */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Enrollments",
              value: data?.total ?? 0,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-950/30",
            },
            {
              label: "Verified",
              value: allEnrollments.filter((e) => e.paymentVerified).length,
              color: "text-green-600",
              bg: "bg-green-50 dark:bg-green-950/30",
            },
            {
              label: "Needs Review",
              value: unverifiedCount,
              color: "text-amber-600",
              bg: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
              label: "Manual",
              value: allEnrollments.filter((e) => e.manuallyEnrolled).length,
              color: "text-purple-600",
              bg: "bg-purple-50 dark:bg-purple-950/30",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
            >
              <p className={cn("text-2xl font-black", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Attention banner */}
      {unverifiedCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <IconAlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {unverifiedCount} enrollment{unverifiedCount !== 1 ? "s" : ""} need payment verification
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-0.5">
              Review these cases — some may be students who were debited but not enrolled due to a failed callback.
            </p>
          </div>
          <button
            onClick={() => setFilter("unverified")}
            className="ml-auto text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
          >
            Show these →
          </button>
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <IconX size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors",
                filter === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 dark:border-gray-700 text-muted-foreground hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              {label}
              {value === "unverified" && unverifiedCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unverifiedCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <IconLoader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconUsers size={24} className="text-muted-foreground" />
            </div>
            <p className="font-black text-gray-900 dark:text-white">No enrollments found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter || debouncedSearch
                ? "Try changing your filters or search term."
                : "Enrollments will appear here once students start signing up."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_auto] gap-4 px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50">
              <span>Student</span>
              <span>Course</span>
              <span>Status / Amount</span>
              <span>Actions</span>
            </div>

            {filtered.map((enrollment) => (
              <div
                key={enrollment.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr_auto] gap-4 items-start sm:items-center px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Student */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0 font-black text-sm text-blue-600">
                    {enrollment.user.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {enrollment.user.firstName} {enrollment.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {enrollment.user.email}
                    </p>
                    {enrollment.user.phoneNumber && (
                      <p className="text-xs text-muted-foreground">
                        {enrollment.user.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Course */}
                <div className="min-w-0">
                  <Link
                    href={`/a/courses/${enrollment.course.id}`}
                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                  >
                    {enrollment.course.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {enrollment.course.pricingType === "FREE"
                      ? "Free course"
                      : `${enrollment.course.currency ?? "NGN"} ${enrollment.course.price?.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enrolled {new Date(enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {enrollment.paymentVerified ? (
                      <Badge className="text-xs bg-green-600 hover:bg-green-600 gap-1">
                        <IconShieldCheck size={10} /> Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-amber-600 border-amber-300 gap-1"
                      >
                        <IconAlertCircle size={10} /> Unverified
                      </Badge>
                    )}
                    {enrollment.manuallyEnrolled && (
                      <Badge
                        variant="outline"
                        className="text-xs text-purple-600 border-purple-300"
                      >
                        Manual
                      </Badge>
                    )}
                  </div>
                  {enrollment.amountPaid != null && (
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {enrollment.currency ?? "NGN"}{" "}
                      {enrollment.amountPaid.toLocaleString()}
                    </p>
                  )}
                  {enrollment.flwTransactionId && (
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[140px]">
                      TXN: {enrollment.flwTransactionId}
                    </p>
                  )}
                  {enrollment.adminNotes && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <IconFileText size={11} /> Has support notes
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-xl"
                    title="Edit enrollment"
                    onClick={() => setEditingEnrollment(enrollment)}
                  >
                    <IconPencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/5"
                    title="Revoke enrollment"
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
            ))}
          </div>
        )}
      </div>

      {/* Edit Sheet */}
      <EditEnrollmentSheet
        enrollment={editingEnrollment}
        onClose={() => setEditingEnrollment(null)}
        onSaved={invalidate}
      />
    </div>
  );
}
