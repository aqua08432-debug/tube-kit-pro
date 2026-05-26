"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Palette, Loader2, Download, RefreshCw, Heart, Edit3, Shuffle, Wand2 } from "lucide-react";

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "2:1";
type Quality = "standard" | "hd" | "ultra";

const STYLES = ["Photorealistic", "Digital Art", "Oil Painting", "Anime", "Watercolor", "Cinematic", "Minimalist", "3D Render", "Pixel Art", "Sketch"];

const RANDOM_PROMPTS = [
    "A futuristic city at night with neon lights reflecting on rain-soaked streets, cinematic",
    "A serene mountain lake at golden hour, ultra-detailed, photorealistic",
    "An astronaut floating in space with a coffee cup, digital art style",
    "Ancient Japanese temple surrounded by cherry blossoms, soft watercolor style",
    "A cyberpunk marketplace filled with holographic signs and robots",
];

const MOCK_IMAGES = [
    "https://picsum.photos/seed/ai1/512/512",
    "https://picsum.photos/seed/ai2/512/512",
    "https://picsum.photos/seed/ai3/512/512",
    "https://picsum.photos/seed/ai4/512/512",
];

export default function AIImageGeneratorPage() {
    const [prompt, setPrompt] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
    const [quality, setQuality] = useState<Quality>("hd");
    const [count, setCount] = useState(4);
    const [generating, setGenerating] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [saved, setSaved] = useState<Set<number>>(new Set());

    function handleGenerate() {
        if (!prompt.trim()) return;
        setGenerating(true); setImages([]);
        setTimeout(() => {
            setImages(MOCK_IMAGES.slice(0, count));
            setGenerating(false);
        }, 3500);
    }

    function handleRandomPrompt() {
        setPrompt(RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)]);
    }

    function toggleSave(i: number) {
        setSaved((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
    }

    return (
        <AppLayout>
            <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px 80px" }}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Palette size={20} style={{ color: "#FF2D2D" }} />
                        </div>
                        <div>
                            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>AI Image Generator</h1>
                            <p style={{ color: "#606060", fontSize: "14px" }}>Create stunning images from text prompts using state-of-the-art AI.</p>
                        </div>
                    </div>
                </div>

                {/* Prompt input */}
                <div className="glass-card p-5 mb-5">
                    <div className="relative mb-3">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to create..."
                            rows={3}
                            className="input-field"
                            style={{ resize: "none", lineHeight: 1.6, fontSize: "15px", paddingBottom: "40px" }}
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button onClick={() => { setPrompt(""); }} className="btn-ghost" style={{ padding: "5px 10px", fontSize: "11px" }}>Clear</button>
                            <button onClick={handleRandomPrompt} className="btn-ghost flex items-center gap-1.5" style={{ padding: "5px 10px", fontSize: "11px" }}>
                                <Shuffle size={11} /> Random
                            </button>
                            <button className="btn-ghost flex items-center gap-1.5" style={{ padding: "5px 10px", fontSize: "11px", color: "#8B5CF6", borderColor: "rgba(139,92,246,0.3)" }}>
                                <Wand2 size={11} /> Enhance Prompt
                            </button>
                        </div>
                    </div>

                    {/* Style presets */}
                    <div className="mb-4" style={{ overflowX: "auto", paddingBottom: "4px" }}>
                        <div className="flex gap-2" style={{ width: "max-content" }}>
                            {STYLES.map((s) => (
                                <button key={s} onClick={() => setSelectedStyle(s)} className="pill" style={{ whiteSpace: "nowrap", background: selectedStyle === s ? "rgba(255,45,45,0.15)" : undefined, borderColor: selectedStyle === s ? "rgba(255,45,45,0.5)" : undefined, color: selectedStyle === s ? "#FF2D2D" : undefined }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Settings row */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px" }}>ASPECT RATIO</label>
                            <div className="flex gap-1.5">
                                {(["1:1", "16:9", "9:16", "4:3", "3:4", "2:1"] as AspectRatio[]).map((r) => (
                                    <button key={r} onClick={() => setAspectRatio(r)} className="pill" style={{ fontSize: "11px", padding: "3px 9px", background: aspectRatio === r ? "rgba(255,45,45,0.15)" : undefined, borderColor: aspectRatio === r ? "rgba(255,45,45,0.5)" : undefined, color: aspectRatio === r ? "#FF2D2D" : undefined }}>
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px" }}>QUALITY</label>
                            <div className="flex gap-1.5">
                                {[{ k: "standard" as Quality, l: "Standard" }, { k: "hd" as Quality, l: "HD" }, { k: "ultra" as Quality, l: "Ultra HD" }].map(({ k, l }) => (
                                    <button key={k} onClick={() => setQuality(k)} className="pill" style={{ fontSize: "11px", padding: "3px 9px", background: quality === k ? "rgba(255,45,45,0.15)" : undefined, borderColor: quality === k ? "rgba(255,45,45,0.5)" : undefined, color: quality === k ? "#FF2D2D" : undefined }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px" }}>NUMBER</label>
                            <div className="flex gap-1.5">
                                {[1, 2, 4].map((n) => (
                                    <button key={n} onClick={() => setCount(n)} className="pill" style={{ fontSize: "11px", padding: "3px 9px", background: count === n ? "rgba(255,45,45,0.15)" : undefined, borderColor: count === n ? "rgba(255,45,45,0.5)" : undefined, color: count === n ? "#FF2D2D" : undefined }}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!prompt || generating}
                            className="btn-red flex items-center gap-2 ml-auto"
                            style={{ padding: "11px 24px", fontSize: "15px", fontWeight: 600, borderRadius: "8px", opacity: !prompt ? 0.5 : 1, position: "relative", zIndex: 1 }}
                        >
                            {generating ? <><Loader2 size={15} className="animate-spin" /> Generating...</> : <><Palette size={15} /> Generate Images</>}
                        </button>
                    </div>
                </div>

                {/* Generating placeholder */}
                {generating && (
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count <= 2 ? count : 2}, 1fr)` }}>
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="rounded-xl shimmer" style={{ aspectRatio: "1", background: "#111" }} />
                        ))}
                    </div>
                )}

                {/* Generated images */}
                {images.length > 0 && !generating && (
                    <div style={{ animation: "slideUp 0.4s ease-out" }}>
                        <div className="flex items-center justify-between mb-4">
                            <p style={{ fontSize: "13px", color: "#606060" }}>{images.length} image{images.length > 1 ? "s" : ""} generated</p>
                            <button onClick={handleGenerate} className="btn-ghost flex items-center gap-2" style={{ padding: "8px 14px", fontSize: "13px" }}>
                                <RefreshCw size={13} /> Regenerate
                            </button>
                        </div>
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${images.length <= 2 ? images.length : 2}, 1fr)` }}>
                            {images.map((src, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <img src={src} alt={`Generated ${i + 1}`} style={{ width: "100%", display: "block" }} />
                                    <div className="absolute inset-0 flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                                        <button onClick={() => toggleSave(i)} className="btn-ghost flex items-center gap-1.5" style={{ padding: "7px 12px", fontSize: "12px", background: "rgba(0,0,0,0.6)" }}>
                                            <Heart size={13} style={{ color: saved.has(i) ? "#FF2D2D" : undefined, fill: saved.has(i) ? "#FF2D2D" : "none" }} /> Save
                                        </button>
                                        <a href={src} download className="btn-ghost flex items-center gap-1.5" style={{ padding: "7px 12px", fontSize: "12px", background: "rgba(0,0,0,0.6)", textDecoration: "none", color: "#A0A0A0" }}>
                                            <Download size={13} /> Download
                                        </a>
                                        <button className="btn-ghost flex items-center gap-1.5" style={{ padding: "7px 12px", fontSize: "12px", background: "rgba(0,0,0,0.6)" }}>
                                            <RefreshCw size={13} /> Variations
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
