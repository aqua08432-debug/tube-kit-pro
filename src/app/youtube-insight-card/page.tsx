"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { LayoutTemplate, Loader2, Download, Share2, QrCode } from "lucide-react";

type CardStyle = "dark" | "light" | "gradient" | "minimal";
type CardSize = "square" | "portrait" | "landscape" | "twitter";

function extractVideoId(url: string) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

const CARD_STYLES: Record<CardStyle, { bg: string; text: string; accent: string; border: string }> = {
    dark: { bg: "#0D0D0D", text: "#FFFFFF", accent: "#FF2D2D", border: "rgba(255,255,255,0.08)" },
    light: { bg: "#F8F8F8", text: "#1a1a1a", accent: "#FF2D2D", border: "rgba(0,0,0,0.08)" },
    gradient: { bg: "linear-gradient(135deg, #1a0a0a, #0a0a1a)", text: "#FFFFFF", accent: "#FF6B35", border: "rgba(255,107,53,0.2)" },
    minimal: { bg: "#FFFFFF", text: "#0a0a0a", accent: "#000", border: "rgba(0,0,0,0.05)" },
};

export default function YouTubeInsightCardPage() {
    const [url, setUrl] = useState("");
    const [processing, setProcessing] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [style, setStyle] = useState<CardStyle>("dark");
    const [size, setSize] = useState<CardSize>("portrait");
    const [inclThumbnail, setInclThumbnail] = useState(true);
    const [inclTitle, setInclTitle] = useState(true);
    const [inclPoints, setInclPoints] = useState(true);
    const [inclChannel, setInclChannel] = useState(true);
    const [inclDuration, setInclDuration] = useState(true);
    const [inclQR, setInclQR] = useState(true);

    const videoId = extractVideoId(url) || "dQw4w9WgXcQ";
    const cs = CARD_STYLES[style];

    const sizeMap: Record<CardSize, { w: number; h: number }> = {
        square: { w: 240, h: 240 },
        portrait: { w: 200, h: 355 },
        landscape: { w: 320, h: 180 },
        twitter: { w: 280, h: 147 },
    };
    const cardDims = sizeMap[size];

    function handleGenerate() {
        if (!url.trim()) return;
        setProcessing(true);
        setTimeout(() => { setProcessing(false); setGenerated(true); }, 2000);
    }

    return (
        <AppLayout>
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <LayoutTemplate size={20} style={{ color: "#EC4899" }} />
                        </div>
                        <div>
                            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>YouTube Insight Card</h1>
                            <p style={{ color: "#606060", fontSize: "14px" }}>Generate a beautiful, shareable insight card from any YouTube video.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    {/* Controls (left) */}
                    <div className="flex flex-col gap-5">
                        {/* URL */}
                        <div className="glass-card p-5">
                            <div className="flex gap-2">
                                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste YouTube URL..." className="input-field" style={{ height: "48px" }} />
                                <button onClick={handleGenerate} disabled={!url || processing} className="btn-red flex items-center gap-2" style={{ padding: "0 18px", height: "48px", fontSize: "14px", fontWeight: 600, borderRadius: "8px", whiteSpace: "nowrap", opacity: !url ? 0.5 : 1, position: "relative", zIndex: 1 }}>
                                    {processing ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><LayoutTemplate size={14} /> Generate Card</>}
                                </button>
                            </div>
                        </div>

                        {/* Card Style */}
                        <div className="glass-card p-5">
                            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>Card Style</h3>
                            <div className="grid grid-cols-2 gap-2 mb-5">
                                {(["dark", "light", "gradient", "minimal"] as CardStyle[]).map((s) => (
                                    <button key={s} onClick={() => setStyle(s)} className="py-2.5 px-3 rounded-lg capitalize" style={{ border: `1px solid ${style === s ? "rgba(255,45,45,0.5)" : "rgba(255,255,255,0.08)"}`, background: style === s ? "rgba(255,45,45,0.1)" : "rgba(255,255,255,0.03)", color: style === s ? "#FF2D2D" : "#A0A0A0", fontSize: "13px", cursor: "pointer" }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>Card Size</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[{ k: "square" as CardSize, l: "Square (1:1)" }, { k: "portrait" as CardSize, l: "Portrait (9:16)" }, { k: "landscape" as CardSize, l: "Landscape (16:9)" }, { k: "twitter" as CardSize, l: "Twitter Card" }].map(({ k, l }) => (
                                    <button key={k} onClick={() => setSize(k)} className="py-2 px-3 rounded-lg" style={{ border: `1px solid ${size === k ? "rgba(255,45,45,0.5)" : "rgba(255,255,255,0.08)"}`, background: size === k ? "rgba(255,45,45,0.1)" : "rgba(255,255,255,0.03)", color: size === k ? "#FF2D2D" : "#A0A0A0", fontSize: "12px", cursor: "pointer" }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Include options */}
                        <div className="glass-card p-5">
                            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>Include</h3>
                            <div className="flex flex-col gap-2.5">
                                {[
                                    { label: "Thumbnail", val: inclThumbnail, set: setInclThumbnail },
                                    { label: "Title", val: inclTitle, set: setInclTitle },
                                    { label: "Key Points", val: inclPoints, set: setInclPoints },
                                    { label: "Channel Name", val: inclChannel, set: setInclChannel },
                                    { label: "Duration", val: inclDuration, set: setInclDuration },
                                    { label: "QR Code", val: inclQR, set: setInclQR },
                                ].map((opt) => (
                                    <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} style={{ accentColor: "#FF2D2D", width: "14px", height: "14px" }} />
                                        <span style={{ fontSize: "13px", color: "#A0A0A0" }}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card Preview (right) */}
                    <div className="flex flex-col gap-4">
                        <div className="glass-card p-5 flex flex-col items-center">
                            <p style={{ fontSize: "12px", color: "#606060", marginBottom: "16px" }}>LIVE PREVIEW</p>

                            {/* Card preview */}
                            <div
                                style={{
                                    width: `${cardDims.w}px`,
                                    height: `${cardDims.h}px`,
                                    background: cs.bg,
                                    border: `1px solid ${cs.border}`,
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    flexShrink: 0,
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {/* Thumbnail */}
                                {inclThumbnail && (
                                    <div style={{ width: "100%", height: size === "portrait" ? "100px" : "60px", background: "#1a1a1a", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                                        <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))" }} />
                                    </div>
                                )}

                                <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {/* Branding */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "linear-gradient(135deg, #FF2D2D, #FF6B35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 800, color: "#fff" }}>TK</div>
                                        <span style={{ fontSize: "8px", fontWeight: 700, color: cs.accent, letterSpacing: "0.05em" }}>TUBEKIT PRO</span>
                                    </div>

                                    {inclTitle && (
                                        <p style={{ fontSize: "9.5px", fontWeight: 700, color: cs.text, lineHeight: 1.3, fontFamily: "'Sora', sans-serif" }}>
                                            How to Build Amazing Web Apps in 2024
                                        </p>
                                    )}

                                    {inclPoints && (
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: "7px", fontWeight: 700, color: cs.accent, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>📌 Key Takeaways</p>
                                            {["React + Next.js dominate in 2024", "TypeScript is non-negotiable", "AI tools 2× dev productivity"].map((p, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "3px", marginBottom: "3px" }}>
                                                    <span style={{ fontSize: "7px", color: cs.accent, flexShrink: 0, marginTop: "1px" }}>•</span>
                                                    <span style={{ fontSize: "7.5px", color: cs.text, opacity: 0.8, lineHeight: 1.4 }}>{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                                        <div>
                                            {inclChannel && <p style={{ fontSize: "7.5px", color: cs.text, opacity: 0.6 }}>🎬 TechMaster Pro</p>}
                                            {inclDuration && <p style={{ fontSize: "7.5px", color: cs.text, opacity: 0.6 }}>⏱ 32:14</p>}
                                        </div>
                                        {inclQR && (
                                            <div style={{ width: "24px", height: "24px", background: cs.text, borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <QrCode size={16} style={{ color: cs.bg === "#0D0D0D" ? "#0D0D0D" : "#fff" }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Download actions */}
                            {generated && (
                                <div className="flex gap-2 mt-5" style={{ animation: "slideUp 0.3s ease-out" }}>
                                    <button className="btn-red flex items-center gap-2" style={{ padding: "10px 16px", fontSize: "13px", position: "relative", zIndex: 1 }}>
                                        <Download size={14} /> PNG
                                    </button>
                                    <button className="btn-ghost flex items-center gap-2" style={{ padding: "10px 16px", fontSize: "13px" }}>
                                        <Download size={14} /> SVG
                                    </button>
                                    <button className="btn-ghost flex items-center gap-2" style={{ padding: "10px 16px", fontSize: "13px" }}>
                                        <Share2 size={14} /> Share
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
