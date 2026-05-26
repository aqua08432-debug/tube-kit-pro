"use client";

import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { MessageSquare, Upload, Send, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

interface Message {
    role: "user" | "ai";
    content: string;
    citations?: number[];
}

const SUGGESTED = ["Summarize this PDF", "What are the key points?", "Find all definitions", "List action items"];

const MOCK_MESSAGES: Message[] = [
    {
        role: "ai",
        content: "Hello! I've read your PDF document. Ask me anything about its content — I'll answer accurately and cite the exact pages.",
        citations: [],
    },
];

export default function PDFChatPage() {
    const [uploaded, setUploaded] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages] = useState(24);
    const chatBottom = useRef<HTMLDivElement>(null);

    const [file, setFile] = useState<File | null>(null);

    function handleFile(f: File) {
        setFile(f);
        setUploaded(true);
        setFileName(f.name);
        setMessages([{
            role: "ai",
            content: `Hello! I've read "${f.name}". Ask me anything about its content!`,
            citations: [],
        }]);
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleSend() {
        if (!input.trim() || !file) return;
        const userMsg: Message = { role: "user", content: input };
        setMessages((m) => [...m, userMsg]);
        const question = input;
        setInput("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("question", question);
            const res = await apiFetch("/pdf-chat", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to get answer");
            const aiResponse: Message = {
                role: "ai",
                content: data.answer,
                citations: [],
            };
            setMessages((m) => [...m, aiResponse]);
        } catch (e: any) {
            setMessages((m) => [...m, { role: "ai", content: `Error: ${e.message}` }]);
        } finally {
            setLoading(false);
            setTimeout(() => chatBottom.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    }

    if (!uploaded) {
        return (
            <AppLayout>
                <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px" }}>
                    <div className="text-center mb-8">
                        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <MessageSquare size={28} style={{ color: "#06B6D4" }} />
                        </div>
                        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "28px", color: "#fff", marginBottom: "8px" }}>PDF Chat</h1>
                        <p style={{ color: "#606060", fontSize: "15px" }}>Upload a PDF and have an AI-powered conversation with it.</p>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        accept=".pdf"
                        style={{ display: "none" }}
                    />

                    <div
                        className={`upload-zone ${dragging ? "dragging" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); e.dataTransfer.files?.[0] && handleFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileInputRef.current?.click()}
                        style={{ padding: "60px 40px" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                            <Upload size={32} style={{ color: dragging ? "#FF2D2D" : "#606060" }} />
                            <div>
                                <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "4px", textAlign: "center" }}>Drop your PDF here</p>
                                <p style={{ fontSize: "13px", color: "#606060", textAlign: "center" }}>or click to browse • Max 50MB</p>
                            </div>
                            <button className="btn-red" style={{ padding: "10px 24px", fontSize: "14px", borderRadius: "8px", position: "relative", zIndex: 1 }}>
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-6">
                        {[{ icon: "🔒", l: "Encrypted" }, { icon: "⚡", l: "Instant" }, { icon: "🗑️", l: "Auto-deleted 24h" }].map((f) => (
                            <div key={f.l} className="flex items-center gap-1.5">
                                <span>{f.icon}</span>
                                <span style={{ fontSize: "12px", color: "#606060" }}>{f.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
                {/* PDF Viewer (left) */}
                <div style={{ width: "40%", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", background: "#0D0D0D" }}>
                    {/* PDF canvas area */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "100%", background: "#1A1A1A", borderRadius: "8px", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.06)", padding: "24px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📄</div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{fileName}</p>
                            <p style={{ fontSize: "12px", color: "#606060", marginBottom: "16px" }}>Page {page} of {totalPages}</p>
                            <div style={{ width: "80%", height: "340px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <p style={{ fontSize: "12px", color: "#3a3a3a", textAlign: "center" }}>PDF content renders here<br />(PDF.js integration)</p>
                            </div>
                        </div>
                    </div>

                    {/* Page controls */}
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <button onClick={() => setPage(Math.max(1, page - 1))} className="btn-ghost" style={{ padding: "6px 10px" }}>
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Page {page} / {totalPages}</span>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="btn-ghost" style={{ padding: "6px 10px" }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Chat (right) */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0A0A0A" }}>
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <MessageSquare size={18} style={{ color: "#06B6D4" }} />
                        <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Chat with {fileName}</p>
                            <p style={{ fontSize: "12px", color: "#606060" }}>AI-powered PDF assistant</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: "flex", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                                <div style={{ width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "ai" ? "rgba(6,182,212,0.15)" : "rgba(255,45,45,0.1)", border: `1px solid ${msg.role === "ai" ? "rgba(6,182,212,0.3)" : "rgba(255,45,45,0.2)"}`, fontSize: "12px" }}>
                                    {msg.role === "ai" ? <Sparkles size={13} style={{ color: "#06B6D4" }} /> : "U"}
                                </div>
                                <div style={{ maxWidth: "75%" }}>
                                    <div style={{ padding: "12px 14px", borderRadius: "12px", background: msg.role === "ai" ? "rgba(255,255,255,0.04)" : "rgba(255,45,45,0.1)", border: `1px solid ${msg.role === "ai" ? "rgba(255,255,255,0.06)" : "rgba(255,45,45,0.2)"}`, fontSize: "14px", color: "#A0A0A0", lineHeight: 1.6 }}>
                                        {msg.content}
                                    </div>
                                    {msg.citations && msg.citations.length > 0 && (
                                        <div className="flex gap-1 mt-1.5 flex-wrap">
                                            {msg.citations.map((p) => (
                                                <button key={p} onClick={() => setPage(p)} className="pill" style={{ fontSize: "10px", padding: "2px 8px", color: "#06B6D4", borderColor: "rgba(6,182,212,0.25)", background: "rgba(6,182,212,0.08)" }}>
                                                    p.{p}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 items-center">
                                <div style={{ width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(6,182,212,0.15)" }}>
                                    <Sparkles size={13} style={{ color: "#06B6D4" }} />
                                </div>
                                <div style={{ display: "flex", gap: "4px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    {[0, 1, 2].map((i) => <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#606060", display: "inline-block", animation: `pulseRed 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                                </div>
                            </div>
                        )}
                        <div ref={chatBottom} />
                    </div>

                    {/* Suggested questions */}
                    {messages.length <= 1 && (
                        <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                            <p style={{ fontSize: "11px", color: "#606060", marginBottom: "8px" }}>Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED.map((s) => (
                                    <button key={s} onClick={() => { setInput(s); }} className="pill" style={{ fontSize: "12px" }}>{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="flex gap-3 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                            placeholder="Ask anything about this PDF..."
                            className="input-field"
                            style={{ height: "48px", fontSize: "14px" }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="btn-red flex items-center justify-center"
                            style={{ width: "48px", height: "48px", borderRadius: "8px", flexShrink: 0, opacity: !input.trim() || loading ? 0.5 : 1, position: "relative", zIndex: 1 }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
