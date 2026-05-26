"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navGroups } from "@/data/nav";
import {
    Download, Music, Video, FileText, Sparkles, Captions, NotebookPen, Headphones,
    Clapperboard, AudioWaveform, Files, FileSearch, Sheet, FileType, Image, Globe,
    AlignLeft, BookOpen, Layers, Mic, Wand2, FolderOpen, Languages, BookOpenCheck,
    MessageSquare, FileCode, ScanSearch, Minimize2, Scissors, Wrench, Table, Code,
    ImageIcon, Hash, FileCheck, Monitor, Text, Film, FileEdit, BarChart2, ImageOff,
    Book, FileBarChart, LayoutTemplate, FileType2, Presentation, Globe2, Type,
    Palette, ChevronRight, Search, Crown, X
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    Download, Music, Video, FileText, Sparkles, Captions, NotebookPen, Headphones,
    Clapperboard, AudioWaveform, Files, FileSearch, Sheet, FileType, Image, Globe,
    AlignLeft, BookOpen, Layers, Mic, Wand2, FolderOpen, Languages, BookOpenCheck,
    MessageSquare, FileCode, ScanSearch, Minimize2, Scissors, Wrench, Table, Code,
    ImageIcon, Hash, FileCheck, Monitor, Text, Film, FileEdit, BarChart2, ImageOff,
    Book, FileBarChart, LayoutTemplate, FileType2, Presentation, Globe2, Type,
    Palette, Search, PresentationIcon: Presentation,
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (title: string) => {
        setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const filteredGroups = navGroups.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((group) => group.items.length > 0);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
                style={{
                    width: "280px",
                    background: "#0D0D0D",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-3 px-4 py-5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div className="tk-logo">TK</div>
                    <div>
                        <div
                            style={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 700,
                                fontSize: "16px",
                                color: "#fff",
                                lineHeight: 1.2,
                            }}
                        >
                            TubeKit Pro
                        </div>
                        <div style={{ fontSize: "11px", color: "#606060", lineHeight: 1 }}>
                            Every tool you need.
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto lg:hidden"
                        style={{ color: "#606060" }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-3 py-3">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: "#606060" }}
                        />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                            style={{
                                paddingLeft: "34px",
                                fontSize: "13px",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                            }}
                        />
                    </div>
                </div>

                {/* Nav Groups */}
                <nav className="flex-1 px-3 pb-4">
                    {filteredGroups.map((group) => (
                        <div key={group.title}>
                            <button
                                onClick={() => toggleGroup(group.title)}
                                className="section-label flex items-center justify-between w-full hover:text-gray-300 transition-colors"
                                style={{ cursor: "pointer", background: "none", border: "none" }}
                            >
                                <span>{group.title}</span>
                                <ChevronRight
                                    size={12}
                                    style={{
                                        transform: collapsedGroups[group.title] ? "rotate(0deg)" : "rotate(90deg)",
                                        transition: "transform 0.2s ease",
                                        color: "#606060",
                                    }}
                                />
                            </button>

                            {!collapsedGroups[group.title] && (
                                <div className="flex flex-col gap-0.5">
                                    {group.items.map((item) => {
                                        const Icon = iconMap[item.icon];
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`nav-item ${isActive ? "active" : ""}`}
                                                onClick={onClose}
                                            >
                                                {Icon && (
                                                    <Icon
                                                        size={15}
                                                        className="flex-shrink-0"
                                                        style={{ color: isActive ? "#FF2D2D" : "#606060" }}
                                                    />
                                                )}
                                                <span className="flex-1 truncate">{item.label}</span>
                                                {item.badge && (
                                                    <span
                                                        style={{
                                                            fontSize: "9px",
                                                            fontWeight: 700,
                                                            padding: "2px 5px",
                                                            borderRadius: "3px",
                                                            background:
                                                                item.badge === "HOT"
                                                                    ? "rgba(255,45,45,0.15)"
                                                                    : "rgba(139,92,246,0.15)",
                                                            color: item.badge === "HOT" ? "#FF2D2D" : "#8B5CF6",
                                                            border:
                                                                item.badge === "HOT"
                                                                    ? "1px solid rgba(255,45,45,0.25)"
                                                                    : "1px solid rgba(139,92,246,0.25)",
                                                            letterSpacing: "0.05em",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Upgrade CTA */}
                <div
                    className="mx-3 mb-4 p-4 rounded-xl"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,45,45,0.12), rgba(255,107,53,0.08))",
                        border: "1px solid rgba(255,45,45,0.2)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Crown size={15} style={{ color: "#FF2D2D" }} />
                        <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Sora', sans-serif", color: "#fff" }}>
                            Upgrade to Pro
                        </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#A0A0A0", marginBottom: "12px", lineHeight: 1.5 }}>
                        Unlimited downloads, 4K quality, AI features & more.
                    </p>
                    <button
                        className="btn-red w-full"
                        style={{ padding: "8px 16px", fontSize: "13px", position: "relative", zIndex: 1 }}
                    >
                        Upgrade — $9.99/mo
                    </button>
                </div>
            </aside>
        </>
    );
}
