import { useEffect, useMemo, useRef } from "react";

/**
 * Returns a debounced wrapper whose identity is stable across renders, so the
 * pending timer survives re-rendering. The wrapper always invokes the most
 * recent `callback`, and any pending call is dropped on unmount.
 *
 * Both properties matter here: creating the debouncer inline would rebuild it
 * every render and never actually debounce, and capturing `callback` once would
 * leave the timer calling a stale closure.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) => {
  const latest = useRef(callback);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    latest.current = callback;
  });

  useEffect(() => () => clearTimeout(timer.current), []);

  return useMemo(
    () =>
      (...args: Args) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => latest.current(...args), delayMs);
      },
    [delayMs],
  );
};
