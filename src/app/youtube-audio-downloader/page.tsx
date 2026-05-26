"use client";
import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Headphones, Loader2, Download, CheckCircle, AlertCircle, Play, Music, Search } from "lucide-react";

export default function YouTubeAudioDownloaderPage() {
    const [url, setUrl] = useState("");
    const [format, setFormat] = useState("mp3");
    const [bitrate, setBitrate] = useState("320");
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [jobId, setJobId] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const pollRef = useRef<any>(null);

    useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

    async function handleAnalyze() {
        if (!url.trim()) return;
        setProcessing(true); setError(""); setVideoInfo(null);
        try {
            const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.error || "Failed");
            setVideoInfo(data);
        } catch (e: any) { setError(e.message); } finally { setProcessing(false); }
    }

    async function handleConvert() {
        setProcessing(true); setDone(false); setProgress(5); setError(""); setJobId(null);
        try {
            const res = await fetch("/api/download", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, type: "audio", audio_format: format, audio_quality: bitrate })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.error || "Failed");
            const id = data.job_id; setJobId(id);
            pollRef.current = setInterval(async () => {
                const s = await (await fetch(`/api/status/${id}?t=${Date.now()}`, { cache: "no-store" })).json();
                if (s.progress > 0) setProgress(p => Math.max(p, Math.min(95, s.progress)));
                if (s.status === "complete") { clearInterval(pollRef.current); setProgress(100); setFilename(s.filename); setProcessing(false); setDone(true); }
                else if (s.status === "error") { clearInterval(pollRef.current); setError(s.error || "Failed"); setProcessing(false); }
            }, 1500);
        } catch (e: any) { setError(e.message); setProcessing(false); }
    }

    function handleDownload() {
        if (!jobId) return;
        const a = document.createElement("a"); a.href = `/api/file/${jobId}`; if (filename) a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    function handleReset() { if (pollRef.current) clearInterval(pollRef.current); setUrl(""); setProcessing(false); setDone(false); setProgress(0); setError(""); setJobId(null); setFilename(null); setVideoInfo(null); }

    return (
        <AppLayout>
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <div className="flex items-center gap-3 mb-8">
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><Headphones size={20} style={{ color: "#FF2D2D" }} /></div>
                    <div><h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>Audio Downloader</h1><p style={{ color: "#606060", fontSize: "14px" }}>Extract high-quality audio from any YouTube video.</p></div>
                </div>

                <div className="glass-card p-6 mb-6">
                    <div className="flex gap-3 mb-5">
                        <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAnalyze()} placeholder="Paste YouTube URL..." className="input-field flex-1" style={{ height: "50px", fontSize: "15px" }} />
                        {!videoInfo && <button onClick={handleAnalyze} disabled={!url || processing} className="btn-red flex items-center gap-2" style={{ padding: "0 20px", height: "50px", fontWeight: 600 }}>
                            {processing && !videoInfo ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Analyze
                        </button>}
                    </div>

                    {videoInfo && !done && (
                        <div style={{ animation: "slideUp 0.3s ease-out" }}>
                            <div className="flex gap-4 p-4 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <img src={videoInfo.thumbnail} alt="" style={{ width: "120px", height: "68px", objectFit: "cover", borderRadius: "6px" }} />
                                <div><h3 style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px", lineHeight: 1.4 }}>{videoInfo.title}</h3><p style={{ fontSize: "12px", color: "#606060" }}>{videoInfo.channel} · {videoInfo.duration}</p></div>
                            </div>

                            <div className="mb-5"><label style={{ fontSize: "12px", color: "#606060", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Format</label>
                                <div className="flex gap-2">
                                    {["mp3", "m4a", "wav", "flac", "ogg"].map(f => <button key={f} onClick={() => setFormat(f)} className="pill" style={{ background: format === f ? "rgba(255,45,45,0.15)" : undefined, borderColor: format === f ? "rgba(255,45,45,0.5)" : undefined, color: format === f ? "#FF2D2D" : undefined }}>{f.toUpperCase()}</button>)}
                                </div>
                            </div>

                            <div className="mb-6"><label style={{ fontSize: "12px", color: "#606060", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bitrate (Audio Quality)</label>
                                <div className="flex flex-wrap gap-2">
                                    {["320", "256", "192", "128"].map(b => <button key={b} onClick={() => setBitrate(b)} className="pill" style={{ background: bitrate === b ? "rgba(255,45,45,0.15)" : undefined, borderColor: bitrate === b ? "rgba(255,45,45,0.5)" : undefined, color: bitrate === b ? "#FF2D2D" : undefined }}>{b} kbps</button>)}
                                </div>
                            </div>

                            <button onClick={handleConvert} disabled={processing} className="btn-red w-full flex items-center justify-center gap-2" style={{ padding: "14px", fontSize: "15px", fontWeight: 700 }}>
                                {processing ? <><Loader2 size={16} className="animate-spin" />Extracting Audio...</> : <><Music size={16} />Download Audio</>}
                            </button>
                        </div>
                    )}

                    {error && <div className="mt-4 flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)", fontSize: "13px", color: "#FF6B6B" }}><AlertCircle size={14} />{error}</div>}
                    {processing && videoInfo && <div className="mt-6"><div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, progress)}%`, transition: "width 0.5s ease" }} /></div><p style={{ fontSize: "12px", color: "#606060", textAlign: "center", marginTop: "8px" }}>{Math.round(progress)}% — Extracting audio stream...</p></div>}
                </div>

                {done && (
                    <div className="glass-card p-8 text-center" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CheckCircle size={24} style={{ color: "#10B981" }} /></div>
                        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Success!</h3>
                        <p style={{ fontSize: "13px", color: "#606060", marginBottom: "20px" }}>{filename}</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={handleDownload} className="btn-red flex items-center gap-2" style={{ padding: "11px 24px", fontSize: "14px" }}><Download size={15} />Save Audio</button>
                            <button onClick={handleReset} className="btn-ghost" style={{ padding: "11px 24px", fontSize: "14px" }}>Download New</button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
