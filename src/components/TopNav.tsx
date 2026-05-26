"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, HelpCircle, Menu, ChevronRight, Home } from "lucide-react";

interface TopNavProps {
    onMenuClick: () => void;
}

function getBreadcrumb(pathname: string): string[] {
    const crumbMap: Record<string, string[]> = {
        "/": ["Home"],
        "/youtube-downloader": ["Home", "AI YouTube", "Video Downloader"],
        "/youtube-summarizer": ["Home", "AI YouTube", "Summarizer"],
        "/youtube-transcript": ["Home", "AI YouTube", "Transcript"],
        "/youtube-subtitle": ["Home", "AI YouTube", "Subtitle"],
        "/youtube-to-notes": ["Home", "AI YouTube", "To Notes"],
        "/youtube-to-mp3": ["Home", "AI YouTube", "To MP3"],
        "/youtube-to-mp4": ["Home", "AI YouTube", "To MP4"],
        "/youtube-audio-downloader": ["Home", "AI YouTube", "Audio Downloader"],
        "/youtube-insight-card": ["Home", "Insight Card", "YouTube Card"],
        "/pdf-tools": ["Home", "AI PDF", "PDF Tools"],
        "/pdf-chat": ["Home", "AI PDF", "PDF Chat"],
        "/pdf-to-word": ["Home", "AI PDF", "PDF to Word"],
        "/pdf-to-excel": ["Home", "AI PDF", "PDF to Excel"],
        "/pdf-to-ppt": ["Home", "AI PDF", "PDF to PPT"],
        "/pdf-to-image": ["Home", "AI PDF", "PDF to Image"],
        "/compress-pdf": ["Home", "AI PDF", "Compress PDF"],
        "/ocr-pdf": ["Home", "AI PDF", "OCR PDF"],
        "/ai-image-generator": ["Home", "More Tools", "AI Image Generator"],
        "/ai-video-generator": ["Home", "More Tools", "AI Video Generator"],
    };
    return crumbMap[pathname] || ["Home", ...pathname.slice(1).split("/").map(s => s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))];
}

export default function TopNav({ onMenuClick }: TopNavProps) {
    const pathname = usePathname();
    const crumbs = getBreadcrumb(pathname);
    const [notifications] = useState(2);

    return (
        <header
            className="flex items-center justify-between px-6 py-4 sticky top-0 z-30"
            style={{
                background: "rgba(10,10,10,0.85)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                minHeight: "64px",
            }}
        >
            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg btn-ghost"
                    aria-label="Open menu"
                >
                    <Menu size={18} />
                </button>

                <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
                    {crumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            {i === 0 && (
                                <Home size={13} style={{ color: "#606060" }} />
                            )}
                            {i > 0 && (
                                <ChevronRight size={12} style={{ color: "#3a3a3a" }} />
                            )}
                            <span
                                style={{
                                    fontSize: "13px",
                                    color: i === crumbs.length - 1 ? "#fff" : "#606060",
                                    fontWeight: i === crumbs.length - 1 ? 500 : 400,
                                    textTransform: "capitalize",
                                }}
                            >
                                {crumb}
                            </span>
                        </span>
                    ))}
                </nav>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button
                    className="relative p-2 rounded-lg btn-ghost"
                    aria-label="Notifications"
                >
                    <Bell size={17} />
                    {notifications > 0 && (
                        <span
                            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                            style={{ background: "#FF2D2D" }}
                        />
                    )}
                </button>

                {/* Help */}
                <button className="p-2 rounded-lg btn-ghost" aria-label="Help">
                    <HelpCircle size={17} />
                </button>

                {/* Avatar */}
                <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)", color: "#fff" }}
                    >
                        U
                    </div>
                    <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Account</span>
                </button>
            </div>
        </header>
    );
}
