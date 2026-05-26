"use client";
import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Sparkles, Search, Loader2, Play, Clock, CheckCircle, AlertCircle, RefreshCw, FileText, LayoutList, ListChecks } from "lucide-react";

export default function VideoSummarizerPage() {
    const [url, setUrl] = useState("");
    const [style, setStyle] = useState("bullets");
    const [length, setLength] = useState("medium");
    const [processing, setProcessing] = useState(false);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");

    async function handleAnalyze() {
        if (!url.trim()) return;
        setProcessing(true); setError(""); setVideoInfo(null); setSummary("");
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.error || "Failed");
            setVideoInfo(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setProcessing(false);
        }
    }

    async function handleSummarize() {
        setProcessing(true); setError(""); setSummary("");
        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, style, length, language: "English" })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.error || "Failed to summarize");
            setSummary(data.summary);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <AppLayout>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <div className="flex items-center gap-3 mb-8">
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Sparkles size={20} style={{ color: "#A855F7" }} />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>AI Video Summarizer</h1>
                        <p style={{ color: "#606060", fontSize: "14px" }}>Get instant insights and bullet points from any YouTube video using AI.</p>
                    </div>
                </div>

                <div className="glass-card p-5 mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#606060" }} />
                            <input
                                type="text"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                                placeholder="Paste YouTube URL here..."
                                className="input-field"
                                style={{ paddingLeft: "44px", fontSize: "15px", height: "52px" }}
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={!url || processing}
                            className="btn-red flex items-center gap-2"
                            style={{ padding: "0 24px", height: "52px", fontWeight: 600, minWidth: "130px", background: "#9333EA", borderColor: "#9333EA" }}
                        >
                            {processing && !videoInfo ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Analyze
                        </button>
                    </div>
                    {error && (
                        <div className="mt-3 flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)", fontSize: "13px", color: "#FF6B6B" }}>
                            <AlertCircle size={14} />{error}
                        </div>
                    )}
                </div>

                {videoInfo && (
                    <div style={{ animation: "slideUp 0.3s ease-out" }}>
                        <div className="glass-card mb-6 overflow-hidden">
                            <div className="flex gap-4 p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                                <img src={videoInfo.thumbnail} alt="" style={{ width: "160px", height: "90px", objectFit: "cover", borderRadius: "8px" }} />
                                <div className="flex-1 min-w-0">
                                    <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>{videoInfo.title}</h2>
                                    <div className="flex gap-4" style={{ fontSize: "12px", color: "#606060" }}>
                                        <span className="flex items-center gap-1"><Play size={12} />{videoInfo.channel}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} />{videoInfo.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {!summary ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <label style={{ fontSize: "12px", color: "#606060", display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Summary Style</label>
                                                <div className="flex gap-2">
                                                    {(["bullets", "paragraph"] as const).map(s => (
                                                        <button key={s} onClick={() => setStyle(s)} className="pill flex items-center gap-2" style={{ background: style === s ? "rgba(147,51,234,0.15)" : undefined, borderColor: style === s ? "rgba(147,51,234,0.5)" : undefined, color: style === s ? "#A855F7" : undefined }}>
                                                            {s === "bullets" ? <ListChecks size={14} /> : <LayoutList size={14} />}
                                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: "12px", color: "#606060", display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Length</label>
                                                <div className="flex gap-2">
                                                    {(["short", "medium", "long"] as const).map(l => (
                                                        <button key={l} onClick={() => setLength(l)} className="pill" style={{ background: length === l ? "rgba(147,51,234,0.15)" : undefined, borderColor: length === l ? "rgba(147,51,234,0.5)" : undefined, color: length === l ? "#A855F7" : undefined }}>
                                                            {l.charAt(0).toUpperCase() + l.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSummarize}
                                            disabled={processing}
                                            className="btn-red w-full flex items-center justify-center gap-2"
                                            style={{ padding: "16px", fontSize: "16px", fontWeight: 700, background: "linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)", border: "none", boxShadow: "0 4px 20px rgba(147,51,234,0.3)" }}
                                        >
                                            {processing ? <><Loader2 size={18} className="animate-spin" />Generating Summary...</> : <><Sparkles size={18} />Generate AI Summary</>}
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ animation: "fadeIn 0.5s ease" }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}><FileText size={16} /> Summary Results</h3>
                                            <button onClick={() => setSummary("")} className="btn-ghost flex items-center gap-2" style={{ fontSize: "12px", padding: "6px 12px" }}><RefreshCw size={12} /> Regenerate</button>
                                        </div>
                                        <div style={{
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "12px",
                                            padding: "24px",
                                            color: "#A0A0A0",
                                            fontSize: "15px",
                                            lineHeight: 1.7,
                                            whiteSpace: "pre-wrap"
                                        }}>
                                            {summary}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
