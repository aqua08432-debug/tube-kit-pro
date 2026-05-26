"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { FileText, Search, Loader2, Copy, CheckCircle, AlertCircle, RefreshCw, Clock, Play } from "lucide-react";

export default function YouTubeDescriptionDownloaderPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    async function handleAnalyze() {
        if (!url.trim()) return;
        setLoading(true); setError(""); setVideoInfo(null); setCopied(false);
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
            setLoading(false);
        }
    }

    function handleCopy() {
        if (!videoInfo?.description) return;
        navigator.clipboard.writeText(videoInfo.description);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <AppLayout>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <div className="flex items-center gap-3 mb-8">
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={20} style={{ color: "#FF2D2D" }} />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>Description Downloader</h1>
                        <p style={{ color: "#606060", fontSize: "14px" }}>Extract and download the full description of any YouTube video.</p>
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
                            disabled={!url || loading}
                            className="btn-red flex items-center gap-2"
                            style={{ padding: "0 24px", height: "52px", fontWeight: 600, minWidth: "130px" }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
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
                            <div className="p-5 flex gap-4 border-bottom" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <img src={videoInfo.thumbnail} alt="" style={{ width: "120px", height: "68px", objectFit: "cover", borderRadius: "6px" }} />
                                <div>
                                    <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{videoInfo.title}</h2>
                                    <div className="flex gap-4" style={{ fontSize: "12px", color: "#606060" }}>
                                        <span className="flex items-center gap-1"><Play size={12} />{videoInfo.channel}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} />{videoInfo.duration}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="btn-red flex items-center gap-2"
                                    style={{ marginLeft: "auto", alignSelf: "center", padding: "8px 16px", fontSize: "13px" }}
                                >
                                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                    {copied ? "Copied!" : "Copy All"}
                                </button>
                            </div>
                            <div className="p-6">
                                <div style={{
                                    background: "rgba(0,0,0,0.2)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    fontSize: "14px",
                                    lineHeight: 1.6,
                                    color: "#A0A0A0",
                                    whiteSpace: "pre-wrap",
                                    fontFamily: "monospace"
                                }}>
                                    {videoInfo.description || "No description available for this video."}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
