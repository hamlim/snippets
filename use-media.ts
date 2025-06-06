/// <reference lib="dom" />

"use client";
import { useEffect, useLayoutEffect, useState } from "react";

let useIsomorphicEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Options {
  defaultMatches?: boolean;
}

export function useMedia(
  query: string,
  { defaultMatches }: Options = { defaultMatches: false },
) {
  let [matches, setMatches] = useState(defaultMatches);

  useIsomorphicEffect(() => {
    function mediaListener(mediaQueryListEvent: MediaQueryListEvent) {
      setMatches(mediaQueryListEvent.matches);
    }

    let mediaQueryList = window.matchMedia(query);

    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", mediaListener);

    return () => {
      mediaQueryList.removeEventListener("change", mediaListener);
    };
  }, [query]);

  return matches;
}
