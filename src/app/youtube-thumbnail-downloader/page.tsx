"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Image as ImageIcon, Download, Search, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function YouTubeThumbnailDownloaderPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleAnalyze() {
        if (!url.trim()) return;
        setLoading(true); setError(""); setVideoInfo(null);
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.error || "Failed");

            // Extract high-quality thumbnail if available
            // yt-dlp usually provides a good thumbnail URL
            setVideoInfo(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function downloadThumbnail(imgUrl: string, name: string) {
        // Since thumbnail URLs are external, we might need a proxy or just open in new tab
        // But for a better UX, we can try to fetch it and create a blob
        fetch(imgUrl)
            .then(res => res.blob())
            .then(blob => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `thumbnail_${name}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(() => {
                // Fallback: open in new tab
                window.open(imgUrl, "_blank");
            });
    }

    return (
        <AppLayout>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <div className="flex items-center gap-3 mb-8">
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageIcon size={20} style={{ color: "#FF2D2D" }} />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>Thumbnail Downloader</h1>
                        <p style={{ color: "#606060", fontSize: "14px" }}>Download high-resolution YouTube video thumbnails instantly.</p>
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
                            {videoInfo ? "New Analysis" : "Analyze"}
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
                        <div className="glass-card overflow-hidden mb-6">
                            <div style={{ background: "#000", position: "relative", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img src={videoInfo.thumbnail} alt={videoInfo.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                                <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.6)", padding: "4px 12px", borderRadius: "20px", color: "#fff", fontSize: "12px", backdropFilter: "blur(4px)" }}>
                                    Preview
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: "18px", color: "#fff", marginBottom: "8px" }}>{videoInfo.title}</h2>
                                <p style={{ color: "#606060", fontSize: "14px", marginBottom: "24px" }}>{videoInfo.channel}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => downloadThumbnail(videoInfo.thumbnail, "maxres")}
                                        className="btn-red flex items-center justify-center gap-2"
                                        style={{ padding: "14px", fontWeight: 700 }}
                                    >
                                        <Download size={18} /> Download HD (1280x720)
                                    </button>
                                    <button
                                        onClick={() => downloadThumbnail(`https://img.youtube.com/vi/${videoInfo.id}/mqdefault.jpg`, "medium")}
                                        className="btn-ghost flex items-center justify-center gap-2"
                                        style={{ padding: "14px" }}
                                    >
                                        <Download size={18} /> Download SD (640x480)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                            <CheckCircle size={18} style={{ color: "#10B981" }} />
                            <p style={{ fontSize: "13px", color: "#10B981" }}>Success! You can now download the thumbnail image directly.</p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
