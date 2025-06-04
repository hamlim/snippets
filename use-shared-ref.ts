import type { RefObject } from "react";
import { useRef } from "react";

export function useSharedRef<T>(
  ref: RefObject<T | null> | ((instance: T | null) => void) | null | undefined,
): [RefObject<T | null>, (node: T | null) => void | (() => void)] {
  const managedRef = useRef<T>(null);

  return [
    managedRef,
    function handleRef(node: T | null): void | (() => void) {
      managedRef.current = node;
      if (typeof ref === "function") {
        const callbackRefResult = ref(node);
        // if the result of the ref callback is a function, return it
        // this handles the case where the ref callback returns a cleanup function
        if (typeof callbackRefResult === "function") {
          return callbackRefResult;
        }
      } else if (ref) {
        ref.current = node;
      }
    },
  ];
}
