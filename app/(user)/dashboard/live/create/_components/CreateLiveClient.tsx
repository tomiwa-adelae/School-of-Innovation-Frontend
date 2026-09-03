"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { postData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { LiveSessionSchema, LiveSessionInput } from "@/lib/zodSchemas";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { ImageUploader } from "@/components/course-builder/ImageUploader";
import { IconLoader2, IconRocket, IconDeviceFloppy } from "@tabler/icons-react";

/** Common African + diaspora zones, so the picker is not an endless list. */
const TIMEZONES = [
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Dubai",
];

const DURATIONS = [30, 45, 60, 90, 120, 180];

/**
 * Combine a local date + time in a named zone into a UTC instant.
 *
 * Built by measuring the zone's offset at that moment rather than assuming
 * one, so it stays correct for zones that observe DST.
 */
function toUtcIso(date: string, time: string, timeZone: string): string {
  const naive = new Date(`${date}T${time}:00Z`);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(naive);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const asZoned = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );

  const offset = asZoned - naive.getTime();
  return new Date(naive.getTime() - offset).toISOString();
}

export default function CreateLiveClient() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, _hasHydrated } = useAuth();

  const form = useForm<LiveSessionInput>({
    resolver: zodResolver(LiveSessionSchema as any),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      date: "",
      startTime: "",
      durationMinutes: 60,
      timezone: "Africa/Lagos",
      isFree: false,
      currency: "NGN",
      meetingUrl: "",
      passcode: "",
    },
  });

  // Default the timezone to wherever the host actually is, if we know it.
  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TIMEZONES.includes(local)) form.setValue("timezone", local);
    } catch {
      /* Keep the Lagos default. */
    }
  }, [form]);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (user && user.role !== "INSTRUCTOR") router.replace("/dashboard");
  }, [user, _hasHydrated, router]);

  const isFree = form.watch("isFree");

  async function submit(values: LiveSessionInput, publish: boolean) {
    const startsAt = toUtcIso(values.date, values.startTime, values.timezone);
    const endsAt = new Date(
      new Date(startsAt).getTime() + values.durationMinutes * 60_000,
    ).toISOString();

    try {
      const session = await postData<{ id: string }>("/live", {
        title: values.title,
        description: values.description || undefined,
        coverImage: values.coverImage || undefined,
        startsAt,
        endsAt,
        timezone: values.timezone,
        capacity: values.capacity,
        pricingType: values.isFree ? "FREE" : "PAID",
        price: values.isFree ? undefined : values.price,
        currency: values.currency,
        provider: "MANUAL_LINK",
        meetingUrl: values.meetingUrl || undefined,
        passcode: values.passcode || undefined,
        publish,
      });

      qc.invalidateQueries({ queryKey: ["hosting-live-sessions"] });
      toast.success(
        publish ? "Class published — it is now open for registration." : "Draft saved.",
      );
      router.push(`/dashboard/live/${session.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : (msg ?? "Could not schedule the class"),
      );
    }
  }

  if (!_hasHydrated) return null;

  return (
    <div className="max-w-2xl">
      <PageHeader
        back
        title="Schedule a live class"
        description="Six fields and you are live. You can add the meeting link later."
      />

      <Form {...form}>
        <form className="space-y-6 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Class title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder="e.g. Live Q&A: Landing Your First Dev Role"
                    className="h-11 rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* When */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="h-11 rounded-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Start time</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" className="h-11 rounded-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Runs for</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-2xl w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DURATIONS.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d < 60 ? `${d} min` : `${d / 60} hr${d > 60 ? "s" : ""}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Timezone</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-2xl w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Students in other countries see this converted to their own
                  time automatically.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <div className="rounded-2xl border p-4 space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4">
                  <div>
                    <FormLabel className="font-bold">Free class</FormLabel>
                    <FormDescription>
                      Anyone with an account can reserve a seat.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isFree && (
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="font-bold">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                            )
                          }
                          placeholder="5000"
                          className="h-11 rounded-2xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Currency</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-2xl w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["NGN", "USD", "GHS", "KES", "ZAR"].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Seat limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : Number(e.target.value),
                      )
                    }
                    placeholder="Leave blank for unlimited"
                    className="h-11 rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Meeting link */}
          <div className="rounded-2xl border p-4 space-y-4">
            <FormField
              control={form.control}
              name="meetingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Meeting link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://zoom.us/j/… or https://meet.google.com/…"
                      className="h-11 rounded-2xl"
                    />
                  </FormControl>
                  <FormDescription>
                    Only released to people who registered, and only from 10
                    minutes before the start. Turn on your waiting room and
                    admit from the roster for extra safety.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Passcode{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11 rounded-2xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Optional presentation */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    folder="thumbnails"
                    label="Cover image (optional)"
                    aspectRatio="aspect-video"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  What will you cover?{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="A few lines on what students will get out of this session."
                    className="rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit((v) => submit(v, false))}
            >
              <IconDeviceFloppy size={16} /> Save as draft
            </Button>
            <Button
              type="button"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit((v) => submit(v, true))}
            >
              {form.formState.isSubmitting ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <IconRocket size={16} /> Publish class
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
