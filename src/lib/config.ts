// API Configuration for TubeKit Pro
// Handles both local dev (proxied to Python on :8000) and Vercel (serverless Python)

export const API_BASE_URL = "";

export const IS_NATIVE =
  typeof window !== "undefined" && (window as any).Capacitor !== undefined;

export function getApiUrl(endpoint: string): string {
  const clean = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `/api${clean}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return response;
}

/** Read a query-string param from the current URL (client-side only). */
export function getQueryParam(key: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

/**
 * Full polling download flow shared across all YouTube tool pages.
 * Calls /api/download, polls /api/status/{id}, returns file URL.
 */
export async function startDownloadAndPoll(
  payload: Record<string, unknown>,
  onProgress: (p: number) => void
): Promise<{ jobId: string; filename: string }> {
  const res = await apiFetch("/download", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.error || "Download failed");

  const jobId: string = data.job_id;
  onProgress(10);

  return new Promise((resolve, reject) => {
    let polls = 0;
    const MAX = 120;
    const timer = setInterval(async () => {
      polls++;
      try {
        const s = await (
          await apiFetch(`/status/${jobId}?t=${Date.now()}`, { cache: "no-store" })
        ).json();

        if (s.progress > 0) onProgress(Math.min(95, s.progress));

        if (s.status === "complete") {
          clearInterval(timer);
          onProgress(100);
          resolve({ jobId, filename: s.filename });
        } else if (s.status === "error") {
          clearInterval(timer);
          reject(new Error(s.error || "Download failed"));
        } else if (polls >= MAX) {
          clearInterval(timer);
          reject(new Error("Download timed out. Try a shorter video."));
        }
      } catch {
        if (polls >= MAX) {
          clearInterval(timer);
          reject(new Error("Connection lost during download."));
        }
      }
    }, 1500);
  });
}

/** Trigger browser save-file dialog. */
export function saveFile(jobId: string, filename: string) {
  const a = document.createElement("a");
  a.href = getApiUrl(`/file/${jobId}`);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
