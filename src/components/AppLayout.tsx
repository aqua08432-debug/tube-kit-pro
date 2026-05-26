"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen" style={{ background: "#0A0A0A" }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area */}
            <div
                className="flex flex-col flex-1 min-h-screen"
                style={{ marginLeft: "var(--sidebar-width)" }}
            >
                <TopNav onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1" style={{ padding: "0" }}>
                    {children}
                </main>

                {/* Footer */}
                <footer
                    className="px-8 py-6"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="tk-logo" style={{ width: "24px", height: "24px", fontSize: "9px" }}>TK</div>
                            <span style={{ fontSize: "13px", color: "#606060" }}>
                                © 2026 TubeKit Pro. All rights reserved.
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            {[
                                { label: "Terms", href: "/terms" },
                                { label: "Privacy", href: "/privacy" },
                                { label: "DMCA", href: "/dmca" },
                                { label: "About", href: "/about" },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    style={{ fontSize: "13px", color: "#606060" }}
                                    className="hover:text-white transition-colors animated-underline"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>

            {/* Mobile bottom nav */}
            <nav
                className="fixed bottom-0 left-0 right-0 lg:hidden z-50 flex items-center justify-around px-4 py-2"
                style={{
                    background: "rgba(13,13,13,0.95)",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(20px)",
                }}
            >
                {[
                    { label: "Home", href: "/", emoji: "🏠" },
                    { label: "YouTube", href: "/youtube-downloader", emoji: "▶" },
                    { label: "PDF", href: "/pdf-tools", emoji: "📄" },
                    { label: "AI", href: "/youtube-summarizer", emoji: "🤖" },
                    { label: "More", href: "#", emoji: "⋯", onClick: () => setSidebarOpen(true) },
                ].map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick?.(); } : undefined}
                        className="flex flex-col items-center gap-1"
                        style={{ color: "#606060", textDecoration: "none", fontSize: "10px" }}
                    >
                        <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
}
