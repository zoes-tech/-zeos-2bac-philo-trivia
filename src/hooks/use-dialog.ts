"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Escape, scroll lock and focus restore for a modal. Keeps the latest onClose
 * in a ref so a parent re-render cannot re-run the setup and lose the previous
 * focus target.
 */
export function useDialog(
  open: boolean,
  onClose: () => void,
  initialFocusRef: RefObject<HTMLElement | null>,
) {
  const closeRef = useRef(onClose);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    initialFocusRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open, initialFocusRef]);
}
