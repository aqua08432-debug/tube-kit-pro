// Shared hook — reads ?url= from the query string and auto-runs analyze
"use client";
import { useEffect, useRef, useState } from "react";

export function useUrlParam(
  onAnalyze: (url: string) => void
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [url, setUrl] = useState("");
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    const param = new URLSearchParams(window.location.search).get("url") || "";
    if (param) {
      setUrl(param);
      didRun.current = true;
      // small delay so state settles before calling analyze
      setTimeout(() => onAnalyze(param), 120);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [url, setUrl];
}
