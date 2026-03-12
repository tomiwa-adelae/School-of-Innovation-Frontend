"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData, deleteData } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatDate, formatMoneyInput } from "@/lib/utils";
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
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NairaIcon } from "@/components/NairaIcon";
import { Loader } from "@/components/Loader";

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
      <SheetContent className="w-full pt-5 pb-10 sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b">
          <SheetTitle>Edit Enrollment - {enrollment?.course?.title}</SheetTitle>
          {enrollment && (
            <div className="space-y-0.5">
              <p className="text-sm font-bold ">
                {enrollment.user.firstName} {enrollment.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {enrollment.user.email}
              </p>
            </div>
          )}
        </SheetHeader>

        {enrollment && (
          <div className="container space-y-4">
            {/* Status banner */}
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

            {/* Verify toggle */}
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
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

            {/* FLW TXN ID */}
            <div className="space-y-1.5">
              <Label>Flutterwave Transaction ID</Label>
              <Input
                value={flwTxId}
                onChange={(e) => setFlwTxId(e.target.value)}
                placeholder="e.g. 7653849201"
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label>Amount Paid</Label>
              <Input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="e.g. 25000"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Support Notes (internal only)</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Student confirmed payment via bank statement. Manually verified TXN# on FLW dashboard."
              />
            </div>

            <Button className="w-full" disabled={saving} onClick={handleSave}>
              {saving && <Loader text="" />}
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
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null,
  );
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
        `Remove ${enrollment.user.firstName} ${enrollment.user.lastName}'s enrollment in "${enrollment.course.title}"?`,
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

  const unverifiedCount = allEnrollments.filter(
    (e) => !e.paymentVerified,
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
        <PageHeader
          description={"Review, verify, and manage all student enrollments"}
          back
          title="Enrollment Management"
        />

        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => refetch()}
        >
          <IconRefresh /> Refresh
        </Button>
      </div>

      {/* Stats row */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            <Card key={label}>
              <CardContent>
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
          {search && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setSearch("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <IconX />
            </Button>
          )}
        </div>
        <div className="flex gap-1.5 items-center flex-wrap">
          {FILTERS.map(({ label, value }) => (
            <Button
              size="sm"
              key={value}
              onClick={() => setFilter(value)}
              variant={filter === value ? "default" : "secondary"}
              className="flex-1"
            >
              {label}
              {value === "unverified" && unverifiedCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unverifiedCount}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <IconLoader2
              size={24}
              className="animate-spin text-muted-foreground"
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconUsers size={24} className="text-muted-foreground" />
            </div>
            <p className="font-bold ">No enrollments found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter || debouncedSearch
                ? "Try changing your filters or search term."
                : "Enrollments will appear here once students start signing up."}
            </p>
          </div>
        ) : (
          <>
            <Card className="hidden p-0 sm:block overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status / Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-xl">
                            <AvatarFallback className="bg-blue-50 dark:bg-blue-950/40 text-primary font-black text-xs">
                              {enrollment.user.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold truncate">
                              {enrollment.user.firstName}{" "}
                              {enrollment.user.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {enrollment.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5">
                        <div className="flex flex-col min-w-0">
                          <Link
                            href={`/a/courses/${enrollment.course.id}`}
                            className="text-sm font-bold hover:text-primary transition-colors line-clamp-1"
                          >
                            {enrollment.course.title}
                          </Link>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            Enrolled {formatDate(enrollment.createdAt)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            {enrollment.paymentVerified ? (
                              <Badge className="text-[10px] bg-green-600 hover:bg-green-600 h-5 gap-1 border-none">
                                <IconShieldCheck size={10} /> Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-amber-600 border-amber-200 h-5 gap-1"
                              >
                                <IconAlertCircle size={10} /> Unverified
                              </Badge>
                            )}
                            {enrollment.manuallyEnrolled && (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-purple-600 border-purple-200 h-5"
                              >
                                Manual
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold">
                              <NairaIcon />
                              {formatMoneyInput(enrollment.amountPaid!)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => setEditingEnrollment(enrollment)}
                          >
                            <IconPencil />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            disabled={revokingId === enrollment.id}
                            onClick={() => handleRevoke(enrollment)}
                          >
                            {revokingId === enrollment.id ? (
                              <Loader text="" />
                            ) : (
                              <IconTrash />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {filtered.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardContent>
                    {/* Header: Student */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarFallback className="bg-blue-50 text-primary font-black">
                          {enrollment.user.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">
                          {enrollment.user.firstName} {enrollment.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {enrollment.user.email}
                        </p>
                      </div>
                    </div>

                    {/* Course Title */}
                    <div className="mb-4">
                      <p className="text-sm font-bold">
                        {enrollment.course.title}
                      </p>
                    </div>

                    {/* Payment Details Grid */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md mb-4">
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
                          Status
                        </p>
                        {enrollment.paymentVerified ? (
                          <span className="text-[10px] font-medium text-green-600 flex items-center gap-1">
                            <IconShieldCheck size={10} /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                            <IconAlertCircle size={10} /> Unverified
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Amount Paid
                        </p>
                        <p className="text-xs font-black">
                          <NairaIcon />
                          {formatMoneyInput(enrollment.amountPaid!)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-muted-foreground italic">
                        {formatDate(enrollment.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEnrollment(enrollment)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/5"
                          disabled={revokingId === enrollment.id}
                          onClick={() => handleRevoke(enrollment)}
                        >
                          {revokingId === enrollment.id ? (
                            <Loader text="Revoking..." />
                          ) : (
                            "Revoke"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
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
