"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Clapperboard, Loader2, Download, RefreshCw, Play, Pause } from "lucide-react";

type GenType = "text2video" | "image2video" | "video2video";
type Duration = "3s" | "5s" | "8s" | "10s";
type Resolution = "720p" | "1080p";
type StyleOption = "Realistic" | "Animated" | "Cinematic";
type Motion = "Slow" | "Normal" | "Fast";
type Camera = "Static" | "Pan left" | "Pan right" | "Zoom in" | "Zoom out";

export default function AIVideoGeneratorPage() {
    const [genType, setGenType] = useState<GenType>("text2video");
    const [prompt, setPrompt] = useState("");
    const [duration, setDuration] = useState<Duration>("5s");
    const [resolution, setResolution] = useState<Resolution>("1080p");
    const [style, setStyle] = useState<StyleOption>("Cinematic");
    const [motion, setMotion] = useState<Motion>("Normal");
    const [camera, setCamera] = useState<Camera>("Zoom in");
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [playing, setPlaying] = useState(false);

    function handleGenerate() {
        if (!prompt.trim()) return;
        setGenerating(true); setDone(false); setProgress(0);
        const iv = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) { clearInterval(iv); setGenerating(false); setDone(true); return 100; }
                return p + Math.random() * 3;
            });
        }, 500);
    }

    const genTypeMap: { k: GenType; l: string }[] = [
        { k: "text2video", l: "Text to Video" },
        { k: "image2video", l: "Image to Video" },
        { k: "video2video", l: "Video to Video" },
    ];

    return (
        <AppLayout>
            <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px 80px" }}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clapperboard size={20} style={{ color: "#8B5CF6" }} />
                        </div>
                        <div>
                            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>AI Video Generator</h1>
                            <p style={{ color: "#606060", fontSize: "14px" }}>Turn text prompts into stunning short AI videos in seconds.</p>
                        </div>
                    </div>
                </div>

                {/* Gen type */}
                <div className="flex gap-2 mb-5">
                    {genTypeMap.map(({ k, l }) => (
                        <button key={k} onClick={() => setGenType(k)} className="pill" style={{ background: genType === k ? "rgba(139,92,246,0.15)" : undefined, borderColor: genType === k ? "rgba(139,92,246,0.5)" : undefined, color: genType === k ? "#8B5CF6" : undefined }}>
                            {l}
                        </button>
                    ))}
                </div>

                {/* Prompt */}
                <div className="glass-card p-5 mb-5">
                    <label style={{ fontSize: "12px", color: "#606060", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A drone flying over a mountain lake at sunrise, cinematic 4K, golden hour lighting..."
                        rows={4}
                        className="input-field"
                        style={{ resize: "none", lineHeight: 1.6, fontSize: "15px", marginBottom: "12px" }}
                    />

                    {/* Settings grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[
                            { label: "Duration", options: ["3s", "5s", "8s", "10s"] as Duration[], value: duration, set: setDuration as (v: string) => void },
                            { label: "Resolution", options: ["720p", "1080p"] as Resolution[], value: resolution, set: setResolution as (v: string) => void },
                            { label: "Style", options: ["Realistic", "Animated", "Cinematic"] as StyleOption[], value: style, set: setStyle as (v: string) => void },
                            { label: "Motion Speed", options: ["Slow", "Normal", "Fast"] as Motion[], value: motion, set: setMotion as (v: string) => void },
                        ].map((row) => (
                            <div key={row.label}>
                                <label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {row.options.map((opt) => (
                                        <button key={opt} onClick={() => row.set(opt)} className="pill" style={{ fontSize: "11px", padding: "3px 9px", background: row.value === opt ? "rgba(139,92,246,0.15)" : undefined, borderColor: row.value === opt ? "rgba(139,92,246,0.5)" : undefined, color: row.value === opt ? "#8B5CF6" : undefined }}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Camera */}
                    <div className="mb-4">
                        <label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Camera Movement</label>
                        <div className="flex flex-wrap gap-1.5">
                            {(["Static", "Pan left", "Pan right", "Zoom in", "Zoom out"] as Camera[]).map((c) => (
                                <button key={c} onClick={() => setCamera(c)} className="pill" style={{ fontSize: "11px", padding: "3px 9px", background: camera === c ? "rgba(139,92,246,0.15)" : undefined, borderColor: camera === c ? "rgba(139,92,246,0.5)" : undefined, color: camera === c ? "#8B5CF6" : undefined }}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!prompt || generating}
                        className="btn-red w-full flex items-center justify-center gap-2"
                        style={{ padding: "14px", fontSize: "16px", fontWeight: 700, borderRadius: "10px", opacity: !prompt ? 0.5 : 1, position: "relative", zIndex: 1, background: "linear-gradient(135deg, #8B5CF6, #FF2D2D)" }}
                    >
                        {generating ? <><Loader2 size={17} className="animate-spin" /> Generating Video...</> : <><Clapperboard size={17} /> Generate Video</>}
                    </button>
                </div>

                {/* Progress */}
                {generating && (
                    <div className="glass-card p-6 mb-5" style={{ animation: "slideUp 0.4s ease-out" }}>
                        <div className="flex items-center justify-between mb-4">
                            <p style={{ fontSize: "14px", color: "#A0A0A0" }}>Generating your video with AI...</p>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 600, color: "#8B5CF6" }}>{Math.round(Math.min(progress, 100))}%</span>
                        </div>
                        <div className="progress-bar mb-3">
                            <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%`, background: "linear-gradient(90deg, #8B5CF6, #FF2D2D)" }} />
                        </div>
                        <p style={{ fontSize: "12px", color: "#606060", textAlign: "center" }}>⏱ Video generation typically takes 30–90 seconds</p>
                    </div>
                )}

                {/* Video result */}
                {done && (
                    <div className="glass-card overflow-hidden" style={{ animation: "slideUp 0.4s ease-out" }}>
                        {/* Video player mock */}
                        <div
                            className="relative flex items-center justify-center"
                            style={{ background: "#0D0D0D", aspectRatio: "16/9", cursor: "pointer" }}
                            onClick={() => setPlaying(!playing)}
                        >
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(255,45,45,0.05))" }} />
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
                                {playing ? <Pause size={24} style={{ color: "#fff" }} /> : <Play size={24} style={{ color: "#fff" }} />}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="progress-bar" style={{ height: "3px" }}>
                                    <div style={{ width: playing ? "45%" : "0%", height: "100%", background: "#8B5CF6", borderRadius: "999px", transition: "width 0.3s ease" }} />
                                </div>
                            </div>
                            <div className="absolute top-3 right-3">
                                <span className="pill" style={{ fontSize: "10px", background: "rgba(0,0,0,0.7)", color: "#fff", borderColor: "rgba(255,255,255,0.1)" }}>{duration} • {resolution}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4">
                            <p style={{ fontSize: "13px", color: "#A0A0A0", maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prompt}</p>
                            <div className="flex gap-2">
                                <button className="btn-red flex items-center gap-1.5" style={{ padding: "8px 16px", fontSize: "13px", position: "relative", zIndex: 1 }}>
                                    <Download size={13} /> MP4
                                </button>
                                <button onClick={() => { setDone(false); setProgress(0); }} className="btn-ghost flex items-center gap-1.5" style={{ padding: "8px 16px", fontSize: "13px" }}>
                                    <RefreshCw size={13} /> Variation
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
