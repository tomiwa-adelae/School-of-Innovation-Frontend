"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData, updateData, deleteData } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  IconTicket,
  IconPlus,
  IconTrash,
  IconLoader2,
  IconCheck,
  IconUsers,
  IconDotsVertical,
  IconEdit,
  IconBan,
  IconPlayerPlay,
  IconWorld,
  IconList,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponScope = "ALL" | "SPECIFIC";

interface Coupon {
  id: string;
  code: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  perUserLimit: number;
  expiresAt: string | null;
  isActive: boolean;
  scope: CouponScope;
  courseIds: string[];
  createdAt: string;
  creator: { id: string; firstName: string; lastName: string };
  _count: { redemptions: number };
}

interface CourseOption {
  id: string;
  title: string;
  pricingType: string;
  price: number | null;
}

// ─── Coupon Form Dialog (Create / Edit) ───────────────────────────────────────

function CouponFormDialog({
  open,
  onClose,
  coupon,
}: {
  open: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!coupon;

  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("10");
  const [maxUses, setMaxUses] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");
  const [scope, setScope] = useState<CouponScope>("ALL");
  const [courseIds, setCourseIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (coupon) {
      setCode(coupon.code);
      setDiscountValue(String(coupon.discountValue));
      setMaxUses(coupon.maxUses != null ? String(coupon.maxUses) : "");
      setPerUserLimit(String(coupon.perUserLimit));
      setExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "");
      setScope(coupon.scope);
      setCourseIds(coupon.courseIds ?? []);
    } else {
      setCode("");
      setDiscountValue("10");
      setMaxUses("");
      setPerUserLimit("1");
      setExpiresAt("");
      setScope("ALL");
      setCourseIds([]);
    }
  }, [open, coupon]);

  const { data: courses = [], isLoading: loadingCourses } = useQuery<
    CourseOption[]
  >({
    queryKey: ["admin-courses-for-coupons"],
    queryFn: () => fetchData("/admin/courses"),
    enabled: open && scope === "SPECIFIC",
  });

  const paidCourses = courses.filter((c) => c.pricingType === "PAID");

  function toggleCourse(id: string) {
    setCourseIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        code: code.trim().toUpperCase(),
        discountValue: Number(discountValue),
        perUserLimit: Number(perUserLimit) || 1,
        maxUses: maxUses.trim() ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        scope,
        courseIds: scope === "SPECIFIC" ? courseIds : [],
      };
      return isEdit
        ? updateData(`/coupons/${coupon!.id}`, payload)
        : postData("/coupons", payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to save coupon");
    },
  });

  const valid =
    code.trim().length >= 3 &&
    Number(discountValue) >= 1 &&
    Number(discountValue) <= 99 &&
    (scope === "ALL" || courseIds.length > 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the discount coupon's settings."
              : "Generate a percentage discount code for students to use at checkout."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input
                placeholder="e.g. LAUNCH50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono uppercase"
                maxLength={30}
              />
            </div>
            <div className="space-y-2">
              <Label>Discount %</Label>
              <Input
                type="number"
                min={1}
                max={99}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Max Total Uses</Label>
              <Input
                type="number"
                min={1}
                placeholder="Unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Per-User Limit</Label>
              <Input
                type="number"
                min={1}
                value={perUserLimit}
                onChange={(e) => setPerUserLimit(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expiry Date (optional)</Label>
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label>Applies To</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope("ALL")}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all",
                  scope === "ALL"
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700 ring-2 ring-offset-1"
                    : "border-border hover:bg-muted"
                )}
              >
                <IconWorld size={16} />
                All Courses
              </button>
              <button
                type="button"
                onClick={() => setScope("SPECIFIC")}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all",
                  scope === "SPECIFIC"
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700 ring-2 ring-offset-1"
                    : "border-border hover:bg-muted"
                )}
              >
                <IconList size={16} />
                Specific Courses
              </button>
            </div>
          </div>

          {/* Course picker */}
          {scope === "SPECIFIC" && (
            <div className="space-y-2">
              <Label>Select Paid Courses</Label>
              {loadingCourses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : paidCourses.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  No paid courses found.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-lg border divide-y">
                  {paidCourses.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 p-2.5 text-sm cursor-pointer hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={courseIds.includes(c.id)}
                        onCheckedChange={() => toggleCourse(c.id)}
                      />
                      <span className="flex-1 truncate">{c.title}</span>
                      {c.price != null && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {c.price.toLocaleString()}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
              {courseIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {courseIds.length} course{courseIds.length === 1 ? "" : "s"}{" "}
                  selected
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!valid || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <Loader text={isEdit ? "Saving..." : "Creating..."} />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Coupon"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCouponsClient() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMINISTRATOR") router.push("/dashboard");
  }, [user, router]);

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: () => fetchData("/coupons"),
    enabled: user?.role === "ADMINISTRATOR",
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateData(`/coupons/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteData<{ deactivated: boolean }>(`/coupons/${id}`),
    onSuccess: (data) => {
      toast.success(
        data?.deactivated
          ? "Coupon has redemptions — it was deactivated instead of deleted"
          : "Coupon deleted"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete coupon");
    },
  });

  if (!user || user.role !== "ADMINISTRATOR") return null;

  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  const stats = [
    { label: "Total Coupons", value: coupons.length, icon: IconTicket },
    { label: "Active Coupons", value: activeCoupons, icon: IconCheck },
    { label: "Total Redemptions", value: totalRedemptions, icon: IconUsers },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        back
        title="Coupons"
        description="Create and manage discount coupons for paid courses."
        action={
          <Button
            onClick={() => {
              setEditTarget(null);
              setShowForm(true);
            }}
          >
            <IconPlus size={16} />
            Create Coupon
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
              <s.icon size={20} className="text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800">
          <IconTicket size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-bold">No coupons yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first discount coupon to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="p-0 hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <span className="font-mono font-semibold text-sm">
                        {c.code}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {c.discountValue}% off
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.scope === "ALL"
                        ? "All courses"
                        : `${c.courseIds.length} course${c.courseIds.length === 1 ? "" : "s"}`}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.usedCount} / {c.maxUses ?? "∞"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.expiresAt ? formatDate(c.expiresAt) : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={c.isActive}
                          onCheckedChange={(checked) =>
                            toggleMutation.mutate({ id: c.id, isActive: checked })
                          }
                        />
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            c.isActive
                              ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDotsVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditTarget(c);
                              setShowForm(true);
                            }}
                          >
                            <IconEdit size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toggleMutation.mutate({ id: c.id, isActive: !c.isActive })
                            }
                          >
                            {c.isActive ? (
                              <>
                                <IconBan size={14} className="mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <IconPlayerPlay size={14} className="mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(c)}
                          >
                            <IconTrash size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {coupons.map((c) => (
              <Card key={c.id} className="p-0 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-semibold text-sm">{c.code}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.discountValue}% off
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2">
                          <IconDotsVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditTarget(c);
                            setShowForm(true);
                          }}
                        >
                          <IconEdit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleMutation.mutate({ id: c.id, isActive: !c.isActive })
                          }
                        >
                          {c.isActive ? (
                            <>
                              <IconBan size={14} className="mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <IconPlayerPlay size={14} className="mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <IconTrash size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Scope</span>
                      <span className="text-xs">
                        {c.scope === "ALL"
                          ? "All courses"
                          : `${c.courseIds.length} course${c.courseIds.length === 1 ? "" : "s"}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Usage</span>
                      <span className="text-xs">
                        {c.usedCount} / {c.maxUses ?? "∞"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Expires</span>
                      <span className="text-xs">
                        {c.expiresAt ? formatDate(c.expiresAt) : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          c.isActive
                            ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                        )}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <CouponFormDialog
        open={showForm}
        coupon={editTarget}
        onClose={() => {
          setShowForm(false);
          setEditTarget(null);
        }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-mono font-semibold">{deleteTarget?.code}</span>.
              {deleteTarget && deleteTarget.usedCount > 0 && (
                <>
                  {" "}
                  This coupon has already been used {deleteTarget.usedCount} time
                  {deleteTarget.usedCount === 1 ? "" : "s"}, so it will be
                  deactivated instead of deleted.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? (
                <IconLoader2 className="size-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
