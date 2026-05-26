"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Upload, Loader2, Download, CheckCircle, X, CloudUpload, Mail, Cloud } from "lucide-react";

interface PDFConverterPageProps {
    title: string;
    subtitle: string;
    targetFormat: string;
    targetExt: string;
    iconColor: string;
    icon: React.ReactNode;
    conversionOptions?: React.ReactNode;
}

export default function PDFConverterTemplate({
    title, subtitle, targetFormat, targetExt, iconColor, icon, conversionOptions,
}: PDFConverterPageProps) {
    const [file, setFile] = useState<{ name: string; size: string; pages: number } | null>(null);
    const [dragging, setDragging] = useState(false);
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [pastedUrl, setPastedUrl] = useState("");

    function simulateUpload() {
        setFile({ name: "document.pdf", size: "2.4 MB", pages: 12 });
        setDone(false);
    }

    function handleConvert() {
        if (!file) return;
        setConverting(true); setProgress(0); setDone(false);
        const iv = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) { clearInterval(iv); setConverting(false); setDone(true); return 100; }
                return p + Math.random() * 10;
            });
        }, 250);
    }

    function handleRemove() { setFile(null); setDone(false); setProgress(0); }

    return (
        <AppLayout>
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${iconColor}18`, border: `1px solid ${iconColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {icon}
                        </div>
                        <div>
                            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>{title}</h1>
                            <p style={{ color: "#606060", fontSize: "14px" }}>{subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Upload zone */}
                {!file && (
                    <div
                        className={`upload-zone ${dragging ? "dragging" : ""} mb-5`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); simulateUpload(); }}
                        onClick={simulateUpload}
                        style={{ padding: "56px 40px" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                            <CloudUpload size={36} style={{ color: dragging ? "#FF2D2D" : "#606060" }} />
                            <div>
                                <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "4px", textAlign: "center" }}>Drop PDF here or click to browse</p>
                                <p style={{ fontSize: "13px", color: "#606060", textAlign: "center" }}>Max 50MB • SSL Encrypted • Auto-deleted in 24 hours</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alternative inputs */}
                {!file && (
                    <div className="mb-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="divider flex-1" />
                            <span style={{ fontSize: "12px", color: "#606060" }}>OR</span>
                            <div className="divider flex-1" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input type="text" value={pastedUrl} onChange={(e) => setPastedUrl(e.target.value)} placeholder="Paste file URL..." className="input-field" style={{ fontSize: "13px", padding: "9px 14px" }} />
                            </div>
                            <button className="btn-ghost flex items-center gap-2" style={{ padding: "9px 14px", fontSize: "13px", whiteSpace: "nowrap" }}>
                                <Cloud size={14} /> Google Drive
                            </button>
                        </div>
                    </div>
                )}

                {/* File info card */}
                {file && !done && (
                    <div className="glass-card mb-5 p-4">
                        <div className="flex items-center gap-3">
                            <div style={{ fontSize: "28px" }}>📄</div>
                            <div className="flex-1 min-w-0">
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>{file.name}</p>
                                <p style={{ fontSize: "12px", color: "#606060" }}>{file.size} • {file.pages} pages</p>
                            </div>
                            <button onClick={handleRemove} className="btn-ghost" style={{ padding: "6px" }}>
                                <X size={15} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Conversion options */}
                {file && conversionOptions && !done && (
                    <div className="glass-card p-5 mb-5">{conversionOptions}</div>
                )}

                {/* Convert button */}
                {file && !converting && !done && (
                    <button onClick={handleConvert} className="btn-red w-full flex items-center justify-center gap-2" style={{ padding: "15px", fontSize: "16px", fontWeight: 700, borderRadius: "10px", position: "relative", zIndex: 1 }}>
                        <Upload size={17} /> Convert to {targetFormat}
                    </button>
                )}

                {/* Progress */}
                {converting && (
                    <div className="glass-card p-6" style={{ animation: "slideUp 0.4s ease-out" }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Loader2 size={15} className="animate-spin" style={{ color: "#FF2D2D" }} />
                                <span style={{ fontSize: "14px", color: "#A0A0A0" }}>Converting to {targetFormat}...</span>
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 600, color: "#fff" }}>{Math.round(Math.min(progress, 100))}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                    </div>
                )}

                {/* Done */}
                {done && (
                    <div className="glass-card p-8 text-center" style={{ animation: "slideUp 0.4s ease-out", borderColor: "rgba(16,185,129,0.25)" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                            <CheckCircle size={26} style={{ color: "#10B981" }} />
                        </div>
                        <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Conversion Complete!</h3>
                        <p style={{ fontSize: "13px", color: "#606060", marginBottom: "20px" }}>Your {targetFormat} file is ready. It will be auto-deleted in 24 hours.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <button className="btn-red flex items-center gap-2" style={{ padding: "11px 22px", fontSize: "14px", fontWeight: 600, position: "relative", zIndex: 1 }}>
                                <Download size={15} /> Download {targetExt}
                            </button>
                            <button className="btn-ghost flex items-center gap-2" style={{ padding: "11px 22px", fontSize: "14px" }}>
                                <Mail size={15} /> Send to Email
                            </button>
                            <button className="btn-ghost flex items-center gap-2" style={{ padding: "11px 22px", fontSize: "14px" }}>
                                <Cloud size={15} /> Save to Drive
                            </button>
                        </div>
                    </div>
                )}

                {/* Info footer */}
                <div className="flex items-center justify-center gap-6 mt-6">
                    {["🔒 SSL Encrypted", "⚡ Fast Conversion", "🗑️ Auto-deleted 24h"].map((t) => (
                        <span key={t} style={{ fontSize: "12px", color: "#606060" }}>{t}</span>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
