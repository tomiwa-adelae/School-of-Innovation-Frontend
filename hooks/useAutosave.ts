"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Options<T> {
  /** Called with the latest value once the user stops changing it. */
  onSave: (value: T) => Promise<void>;
  /** Quiet period before saving, in ms. */
  delay?: number;
  /** Skip saving entirely (e.g. before the draft exists). */
  enabled?: boolean;
}

/**
 * Debounced autosave.
 *
 * Replaces the "fill in twelve fields, then press Save, then hope you did not
 * close the tab" flow: the caller pushes every change in and this batches them
 * into one request per quiet period. Always saves the most recent value, even
 * if it arrives while an earlier save is still in flight.
 */
export function useAutosave<T>({ onSave, delay = 900, enabled = true }: Options<T>) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const pending = useRef<{ value: T } | null>(null);

  // Keep the latest onSave without restarting the debounce on every render.
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const flush = useCallback(async () => {
    if (inFlight.current || !pending.current) return;

    const next = pending.current;
    pending.current = null;
    inFlight.current = true;
    setStatus("saving");

    try {
      await onSaveRef.current(next.value);
      setStatus("saved");
      setLastSavedAt(new Date());
    } catch {
      // Put the value back so the next attempt still carries the user's edit.
      pending.current ??= next;
      setStatus("error");
    } finally {
      inFlight.current = false;
      // A change landed mid-save — run again with the newer value.
      if (pending.current) void flush();
    }
  }, []);

  const save = useCallback(
    (value: T) => {
      if (!enabled) return;
      pending.current = { value };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), delay);
    },
    [delay, enabled, flush],
  );

  /** Save immediately — for blur, or before navigating away. */
  const saveNow = useCallback(
    (value?: T) => {
      if (!enabled) return;
      if (value !== undefined) pending.current = { value };
      if (timer.current) clearTimeout(timer.current);
      return flush();
    },
    [enabled, flush],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { save, saveNow, status, lastSavedAt };
}
