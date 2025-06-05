import type { Ref, RefObject } from "react";
import { useCallback, useRef } from "react";

export function useSharedRef<T>(
  ref: Ref<T | null> | undefined,
): [RefObject<T | null>, (node: T | null) => void | (() => void)] {
  const managedRef = useRef<T>(null);

  const handleRef = useCallback(
    (node: T | null): void | (() => void) => {
      managedRef.current = node;
      const isRefCallback = typeof ref === "function";
      let cleanup: void | (() => void);
      if (isRefCallback) {
        cleanup = ref(node);
      } else if (ref) {
        ref.current = node;
      }
      return () => {
        managedRef.current = null;
        if (isRefCallback) {
          if (cleanup) {
            cleanup();
          } else {
            ref(null);
          }
        } else if (ref) {
          ref.current = null;
        }
      };
    },
    [ref],
  );

  return [managedRef, handleRef];
}
