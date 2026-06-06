"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Download, Search, Play, Music, Video, ChevronDown, ChevronUp,
  CheckCircle, Eye, Calendar, Loader2, RefreshCw, Settings2,
  AlertCircle, WifiOff,
} from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

type DownloadType = "video" | "audio";
type Quality = "2160p" | "1080p" | "720p" | "480p" | "360p" | "240p";
type VideoFormat = "mp4" | "webm" | "mkv";
type AudioFormat = "mp3" | "m4a" | "ogg" | "wav" | "flac";
type AudioQuality = "320" | "256" | "192" | "128";
type SubFormat = "srt" | "vtt" | "ass";
type PageState = "idle" | "analyzing" | "ready" | "downloading" | "complete" | "error";

const QUALITIES: Quality[] = ["2160p", "1080p", "720p", "480p", "360p", "240p"];
const Q_LABELS: Record<Quality, string> = {
  "2160p": "4K UHD", "1080p": "Full HD 1080p", "720p": "HD 720p",
  "480p": "SD 480p", "360p": "360p", "240p": "240p",
};
const V_SIZE: Record<Quality, string> = {
  "2160p": "~3.2 GB", "1080p": "~850 MB", "720p": "~420 MB",
  "480p": "~200 MB", "360p": "~120 MB", "240p": "~70 MB",
};
const A_SIZE: Record<AudioQuality, string> = {
  "320": "~80 MB", "256": "~65 MB", "192": "~48 MB", "128": "~32 MB",
};
const SUB_LANGS = [
  ["en", "English"], ["ar", "Arabic"], ["es", "Spanish"], ["fr", "French"],
  ["de", "German"], ["hi", "Hindi"], ["ja", "Japanese"], ["pt", "Portuguese"],
  ["ru", "Russian"], ["zh", "Chinese"],
];

export default function YouTubeDownloaderPage() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<PageState>("idle");
  const [dlType, setDlType] = useState<DownloadType>("video");
  const [quality, setQuality] = useState<Quality>("1080p");
  const [videoFormat, setVideoFormat] = useState<VideoFormat>("mp4");
  const [audioFormat, setAudioFormat] = useState<AudioFormat>("mp3");
  const [audioQuality, setAudioQuality] = useState<AudioQuality>("320");
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [subLang, setSubLang] = useState("en");
  const [subFormat, setSubFormat] = useState<SubFormat>("srt");
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [embedThumbnail, setEmbedThumbnail] = useState(true);
  const [embedChapters, setEmbedChapters] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const pollRef = useRef<any>(null);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  // ── Analyze ─────────────────────────────────────────────────────────────────
  async function handleAnalyze() {
    if (!url.trim()) { setError("Please enter a YouTube URL"); return; }
    setError(""); setState("analyzing"); setVideoInfo(null);
    try {
      const res = await apiFetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed to analyze video");
      setVideoInfo(data);
      const avail: Quality[] = data.available_qualities || [];
      if (avail.length > 0 && !avail.includes(quality)) setQuality(avail[0]);
      setState("ready");
      setRetryCount(0);
    } catch (e: any) {
      setError(e.message);
      setState("error");
    }
  }

  // ── Download ─────────────────────────────────────────────────────────────────
  async function handleDownload() {
    if (!isOnline) { setError("You are offline. Check your internet connection."); return; }
    setState("downloading"); setProgress(5); setJobId(null); setError("");
    try {
      const res = await apiFetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url, type: dlType, quality,
          video_format: videoFormat, audio_format: audioFormat,
          audio_quality: audioQuality, start_time: startTime,
          end_time: endTime, embed_thumbnail: embedThumbnail,
          embed_chapters: embedChapters, include_subtitles: includeSubtitles,
          sub_lang: subLang, sub_format: subFormat,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Download failed");

      const id = data.job_id;
      setJobId(id);
      setProgress(10);

      let polls = 0;
      const MAX_POLLS = 120; // 3 min max

      pollRef.current = setInterval(async () => {
        polls++;
        try {
          const s = await (
            await apiFetch(`/status/${id}?t=${Date.now()}`, { cache: "no-store" })
          ).json();

          if (s.progress > 0) setProgress((p) => Math.max(p, Math.min(95, s.progress)));

          if (s.status === "complete") {
            clearInterval(pollRef.current);
            setProgress(100);
            setFilename(s.filename);
            setState("complete");
            setRetryCount(0);
          } else if (s.status === "error") {
            clearInterval(pollRef.current);
            setError(s.error || "Download failed");
            setState("error");
          } else if (polls >= MAX_POLLS) {
            clearInterval(pollRef.current);
            setError("Download timed out. Try a shorter or smaller video.");
            setState("error");
          }
        } catch {
          if (polls >= MAX_POLLS) {
            clearInterval(pollRef.current);
            setError("Connection lost during download.");
            setState("error");
          }
        }
      }, 1500);
    } catch (e: any) {
      setError(e.message);
      setState("error");
    }
  }

  // ── Save file ────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!jobId) return;
    const a = document.createElement("a");
    a.href = getApiUrl(`/file/${jobId}`);
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  function handleReset() {
    if (pollRef.current) clearInterval(pollRef.current);
    setUrl(""); setState("idle"); setVideoInfo(null);
    setProgress(0); setError(""); setJobId(null); setFilename(null); setRetryCount(0);
  }

  const avail: Quality[] = videoInfo?.available_qualities || [];
  const estSize = dlType === "video" ? V_SIZE[quality] : A_SIZE[audioQuality];
  const isActive = ["analyzing", "downloading"].includes(state);

  return (
    <AppLayout>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── Header ── */}
        <div className="mb-8 flex items-center gap-3">
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Download size={20} style={{ color: "#FF2D2D" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: "#fff" }}>
              YouTube Video Downloader
            </h1>
            <p style={{ color: "#606060", fontSize: 14, marginTop: 2 }}>
              Download any YouTube video — choose quality, format, and type.
            </p>
          </div>
        </div>

        {/* ── Offline banner ── */}
        {!isOnline && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg" style={{
            background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)",
            fontSize: 13, color: "#FF6B6B",
          }}>
            <WifiOff size={14} /> You are offline. Please check your internet connection.
          </div>
        )}

        {/* ── URL Input card ── */}
        <div className="glass-card p-5 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#606060" }} />
              <input
                type="text" value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isActive && handleAnalyze()}
                placeholder="Paste YouTube URL here…"
                className="input-field"
                style={{ paddingLeft: 44, fontSize: 15, height: 52 }}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!url.trim() || isActive || !isOnline}
              className="btn-red flex items-center gap-2"
              style={{ padding: "0 24px", height: 52, fontWeight: 600, minWidth: 130, opacity: !url.trim() || isActive ? 0.5 : 1 }}
            >
              {state === "analyzing"
                ? <><Loader2 size={16} className="animate-spin" />Analyzing…</>
                : <><RefreshCw size={16} />{videoInfo ? "Change URL" : "Analyze"}</>}
            </button>
          </div>

          {/* Error */}
          {error && state !== "downloading" && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-lg" style={{
              background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)",
              fontSize: 13, color: "#FF6B6B",
            }}>
              <AlertCircle size={14} />
              <span className="flex-1">{error}</span>
              {state === "error" && retryCount < 3 && (
                <button onClick={() => { setRetryCount((n) => n + 1); handleAnalyze(); }}
                  style={{ color: "#FF2D2D", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>
                  Retry ({retryCount}/3)
                </button>
              )}
              <button onClick={() => { setState("idle"); setError(""); }}
                style={{ color: "#FF2D2D", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* ── Video info card ── */}
        {videoInfo && !["idle", "analyzing"].includes(state) && (
          <div className="glass-card mb-6 overflow-hidden" style={{ animation: "slideUp 0.3s ease-out" }}>
            <div className="flex gap-4 p-5">
              <div style={{ position: "relative", width: 200, flexShrink: 0 }}>
                <img
                  src={videoInfo.thumbnail} alt={videoInfo.title}
                  style={{ width: "100%", height: 112, objectFit: "cover", borderRadius: 8, background: "#1a1a1a" }}
                />
                <span style={{
                  position: "absolute", bottom: 8, right: 8,
                  background: "rgba(0,0,0,0.82)", color: "#fff",
                  fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                }}>
                  {videoInfo.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 17,
                  color: "#fff", marginBottom: 10, lineHeight: 1.4,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {videoInfo.title}
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1" style={{ fontSize: 13, color: "#A0A0A0" }}>
                  <span className="flex items-center gap-1.5">
                    <Play size={13} style={{ color: "#FF2D2D" }} />{videoInfo.channel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} />{Number(videoInfo.views || 0).toLocaleString()} views
                  </span>
                  {videoInfo.published && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />{videoInfo.published}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Options card ── */}
        {["ready", "complete"].includes(state) && videoInfo && (
          <div className="glass-card p-6 mb-6">
            <h3 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15,
              color: "#fff", marginBottom: 20, paddingBottom: 12,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              Download Options
            </h3>

            {/* Type toggle */}
            <div className="mb-5">
              <label style={{ fontSize: 12, color: "#606060", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                Type
              </label>
              <div className="flex flex-wrap gap-3">
                {([["video", Video, "Video (MP4 / WebM / MKV)"], ["audio", Music, "Audio Only (MP3 / WAV / FLAC)"]] as any[]).map(([val, Icon, label]) => (
                  <button key={val} onClick={() => setDlType(val)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                    style={{
                      border: `1px solid ${dlType === val ? "rgba(255,45,45,0.4)" : "rgba(255,255,255,0.08)"}`,
                      background: dlType === val ? "rgba(255,45,45,0.1)" : "rgba(255,255,255,0.03)",
                      color: dlType === val ? "#FF2D2D" : "#A0A0A0",
                      fontSize: 14, cursor: "pointer", transition: "all 0.15s",
                    }}>
                    <Icon size={15} />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality (video only) */}
            {dlType === "video" && (
              <div className="mb-5">
                <label style={{ fontSize: 12, color: "#606060", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Quality
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUALITIES.map((q) => {
                    const ok = avail.includes(q);
                    return (
                      <button key={q} onClick={() => ok && setQuality(q)} className="pill"
                        style={{
                          opacity: ok ? 1 : 0.28, cursor: ok ? "pointer" : "not-allowed",
                          background: quality === q ? "rgba(255,45,45,0.15)" : undefined,
                          borderColor: quality === q ? "rgba(255,45,45,0.5)" : undefined,
                          color: quality === q ? "#FF2D2D" : undefined,
                        }}>
                        {Q_LABELS[q]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Format */}
            <div className="mb-5">
              <label style={{ fontSize: 12, color: "#606060", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                Format
              </label>
              <div className="flex flex-wrap gap-2">
                {dlType === "video"
                  ? (["mp4", "webm", "mkv"] as VideoFormat[]).map((f) => (
                    <button key={f} onClick={() => setVideoFormat(f)} className="pill"
                      style={{
                        background: videoFormat === f ? "rgba(255,45,45,0.15)" : undefined,
                        borderColor: videoFormat === f ? "rgba(255,45,45,0.5)" : undefined,
                        color: videoFormat === f ? "#FF2D2D" : undefined,
                      }}>
                      {f.toUpperCase()}
                    </button>
                  ))
                  : (["mp3", "m4a", "ogg", "wav", "flac"] as AudioFormat[]).map((f) => (
                    <button key={f} onClick={() => setAudioFormat(f)} className="pill"
                      style={{
                        background: audioFormat === f ? "rgba(255,45,45,0.15)" : undefined,
                        borderColor: audioFormat === f ? "rgba(255,45,45,0.5)" : undefined,
                        color: audioFormat === f ? "#FF2D2D" : undefined,
                      }}>
                      {f.toUpperCase()}
                    </button>
                  ))}
              </div>
            </div>

            {/* Bitrate (audio only) */}
            {dlType === "audio" && (
              <div className="mb-5">
                <label style={{ fontSize: 12, color: "#606060", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>
                  Bitrate
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["320", "256", "192", "128"] as AudioQuality[]).map((q) => (
                    <button key={q} onClick={() => setAudioQuality(q)} className="pill"
                      style={{
                        background: audioQuality === q ? "rgba(255,45,45,0.15)" : undefined,
                        borderColor: audioQuality === q ? "rgba(255,45,45,0.5)" : undefined,
                        color: audioQuality === q ? "#FF2D2D" : undefined,
                      }}>
                      {q} kbps
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated size */}
            <div className="mb-5 flex items-center gap-3 py-3 px-4 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: "#606060" }}>Estimated file size:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>{estSize}</span>
            </div>

            {/* Subtitles (video only) */}
            {dlType === "video" && (
              <div className="mb-5 p-4 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" checked={includeSubtitles}
                    onChange={(e) => setIncludeSubtitles(e.target.checked)}
                    style={{ accentColor: "#FF2D2D", width: 15, height: 15 }} />
                  <span style={{ fontSize: 13, color: "#A0A0A0" }}>Include subtitles</span>
                </label>
                {includeSubtitles && (
                  <div className="flex flex-wrap gap-3 mt-1">
                    <select value={subLang} onChange={(e) => setSubLang(e.target.value)}
                      className="input-field" style={{ width: "auto", fontSize: 13, padding: "7px 12px" }}>
                      {SUB_LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <div className="flex gap-2">
                      {(["srt", "vtt", "ass"] as SubFormat[]).map((f) => (
                        <button key={f} onClick={() => setSubFormat(f)} className="pill"
                          style={{
                            background: subFormat === f ? "rgba(255,45,45,0.15)" : undefined,
                            borderColor: subFormat === f ? "rgba(255,45,45,0.5)" : undefined,
                            color: subFormat === f ? "#FF2D2D" : undefined,
                          }}>
                          {f.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {state === "ready" && (
              <div className="flex flex-col gap-3">
                <button onClick={handleDownload}
                  className="btn-red flex items-center justify-center gap-2 w-full"
                  style={{ padding: 15, fontSize: 16, fontWeight: 700, borderRadius: 10 }}>
                  <Download size={18} />Download Now
                </button>
                <button onClick={() => setShowAdvanced((v) => !v)}
                  className="btn-ghost flex items-center justify-center gap-2 w-full"
                  style={{ padding: 12, fontSize: 13 }}>
                  <Settings2 size={15} />Advanced Options
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            )}

            {state === "complete" && (
              <div className="flex gap-3">
                <button onClick={handleSave}
                  className="btn-red flex items-center justify-center gap-2 flex-1"
                  style={{ padding: 14, fontSize: 15, fontWeight: 700 }}>
                  <Download size={17} />Save File
                </button>
                <button onClick={handleReset}
                  className="btn-ghost flex items-center justify-center gap-2"
                  style={{ padding: "14px 20px", fontSize: 14 }}>
                  <RefreshCw size={15} />New Download
                </button>
              </div>
            )}

            {/* Advanced options */}
            {showAdvanced && state === "ready" && (
              <div className="mt-4 p-4 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#A0A0A0", marginBottom: 12 }}>
                  Advanced Options
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={{ fontSize: 11, color: "#606060", marginBottom: 4, display: "block" }}>
                      Start Time (HH:MM:SS)
                    </label>
                    <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                      placeholder="00:00:00" className="input-field"
                      style={{ fontSize: 13, padding: "8px 12px", fontFamily: "monospace" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#606060", marginBottom: 4, display: "block" }}>
                      End Time (HH:MM:SS)
                    </label>
                    <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                      placeholder="00:10:00" className="input-field"
                      style={{ fontSize: 13, padding: "8px 12px", fontFamily: "monospace" }} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" checked={embedThumbnail} onChange={(e) => setEmbedThumbnail(e.target.checked)} style={{ accentColor: "#FF2D2D" }} />
                  <span style={{ fontSize: 13, color: "#A0A0A0" }}>Embed thumbnail in file metadata</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={embedChapters} onChange={(e) => setEmbedChapters(e.target.checked)} style={{ accentColor: "#FF2D2D" }} />
                  <span style={{ fontSize: 13, color: "#A0A0A0" }}>Embed chapter markers</span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* ── Progress card ── */}
        {state === "downloading" && (
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" style={{ color: "#FF2D2D" }} />
                <span style={{ fontSize: 14, color: "#A0A0A0" }}>
                  {progress < 15 ? "Starting download…" : progress < 80 ? "Downloading…" : "Processing…"}
                </span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 14, color: "#fff", fontWeight: 600 }}>
                {Math.min(100, Math.round(progress))}%
              </span>
            </div>
            <div className="progress-bar mb-3">
              <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%`, transition: "width 0.5s ease" }} />
            </div>
            <p style={{ fontSize: 12, color: "#606060", textAlign: "center" }}>
              Large videos may take a few minutes. Keep this tab open.
            </p>
          </div>
        )}

        {/* ── Success banner ── */}
        {state === "complete" && (
          <div className="mb-4 flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <CheckCircle size={18} style={{ color: "#10B981", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>Download Complete!</p>
              <p style={{ fontSize: 12, color: "#606060" }}>
                {filename} — click <strong>Save File</strong> above to download to your device.
              </p>
            </div>
          </div>
        )}

        {/* ── Feature pills ── */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: "🔒", title: "Private", desc: "Files go directly to you. Nothing stored on our servers." },
            { icon: "⚡", title: "Fast", desc: "Direct YouTube download. No middleman, no re-encoding." },
            { icon: "🎯", title: "Any Quality", desc: "4K when available. Audio up to 320 kbps." },
          ].map((c) => (
            <div key={c.title} className="p-4 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "#606060", lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}
