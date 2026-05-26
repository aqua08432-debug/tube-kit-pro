"use client";

import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { MessageSquare, Languages, ScanSearch, Minimize2, FileEdit, BarChart2, Monitor, ImageIcon, FileCode, Scissors, Wrench, Hash, FileBarChart, ArrowRight, Upload, CloudUpload } from "lucide-react";

const PDF_TOOLS = [
    { icon: MessageSquare, label: "PDF Chat", desc: "Ask AI questions about your PDF document", href: "/pdf-chat", color: "#06B6D4", featured: true },
    { icon: Languages, label: "PDF Translator", desc: "Translate PDFs to any language instantly", href: "/pdf-translator", color: "#8B5CF6" },
    { icon: ScanSearch, label: "OCR PDF", desc: "Extract text from scanned PDFs with AI OCR", href: "/ocr-pdf", color: "#F59E0B" },
    { icon: Minimize2, label: "Compress PDF", desc: "Reduce PDF file size without quality loss", href: "/compress-pdf", color: "#10B981" },
    { icon: FileEdit, label: "PDF to Word", desc: "Convert PDF to editable .docx file", href: "/pdf-to-word", color: "#3B82F6" },
    { icon: BarChart2, label: "PDF to Excel", desc: "Extract tables from PDFs to spreadsheets", href: "/pdf-to-excel", color: "#22C55E" },
    { icon: Monitor, label: "PDF to PPT", desc: "Convert PDF slides to PowerPoint", href: "/pdf-to-ppt", color: "#FF6B35" },
    { icon: ImageIcon, label: "PDF to Image", desc: "Export each PDF page as high-res image", href: "/pdf-to-image", color: "#EC4899" },
    { icon: FileCode, label: "Markdown to PDF", desc: "Render Markdown files as clean PDFs", href: "/markdown-to-pdf", color: "#A78BFA" },
    { icon: Scissors, label: "Remove Blanks", desc: "Delete blank pages from any PDF", href: "/remove-pdf-blanks", color: "#FB923C" },
    { icon: Wrench, label: "Repair PDF", desc: "Fix corrupt or damaged PDF files", href: "/repair-pdf", color: "#94A3B8" },
    { icon: Hash, label: "PDF to Markdown", desc: "Convert PDF content to Markdown format", href: "/pdf-to-markdown", color: "#34D399" },
];

export default function PDFToolsPage() {
    return (
        <AppLayout>
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>
                {/* Header */}
                <div className="mb-8">
                    <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "32px", color: "#fff", marginBottom: "8px" }}>
                        AI PDF Tools
                    </h1>
                    <p style={{ color: "#606060", fontSize: "16px", lineHeight: 1.6 }}>
                        Everything you need to work with PDFs — convert, compress, edit, and chat with AI.
                    </p>
                </div>

                {/* Upload zone */}
                <div className="upload-zone mb-8" style={{ padding: "48px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,45,45,0.1)", border: "1px solid rgba(255,45,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CloudUpload size={26} style={{ color: "#FF2D2D" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "4px", textAlign: "center" }}>Drop your PDF here</p>
                            <p style={{ fontSize: "13px", color: "#606060", textAlign: "center" }}>or click to upload • Max 50MB • SSL Encrypted</p>
                        </div>
                        <button className="btn-red" style={{ padding: "10px 24px", fontSize: "14px", fontWeight: 600, borderRadius: "8px", position: "relative", zIndex: 1 }}>
                            <span style={{ position: "relative", zIndex: 1 }}>Browse Files</span>
                        </button>
                    </div>
                </div>

                {/* Featured: PDF Chat banner */}
                <Link
                    href="/pdf-chat"
                    className="flex items-center justify-between p-6 rounded-2xl mb-8"
                    style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(139,92,246,0.08))", border: "1px solid rgba(6,182,212,0.2)", textDecoration: "none", transition: "all 0.2s ease" }}
                >
                    <div className="flex items-center gap-4">
                        <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MessageSquare size={24} style={{ color: "#06B6D4" }} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>PDF Chat</span>
                                <span className="feature-badge">Featured</span>
                            </div>
                            <p style={{ fontSize: "14px", color: "#A0A0A0" }}>Upload any PDF and have an AI-powered conversation with it. Get answers, summaries, and insights instantly.</p>
                        </div>
                    </div>
                    <ArrowRight size={20} style={{ color: "#06B6D4", flexShrink: 0 }} />
                </Link>

                {/* Tool Grid */}
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "16px" }}>All PDF Tools</h2>
                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                    {PDF_TOOLS.filter(t => !t.featured).map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="glass-card"
                                style={{ padding: "20px", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "14px" }}
                            >
                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${tool.color}18`, border: `1px solid ${tool.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Icon size={18} style={{ color: tool.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "14px", color: "#fff", marginBottom: "3px" }}>{tool.label}</h3>
                                    <p style={{ fontSize: "12.5px", color: "#606060", lineHeight: 1.5 }}>{tool.desc}</p>
                                </div>
                                <ArrowRight size={14} style={{ color: "#3a3a3a", flexShrink: 0, marginTop: "2px" }} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
