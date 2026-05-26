"use client";

import { LucideIcon } from "lucide-react";
import AppLayout from "./AppLayout";

interface ToolLayoutProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    children: React.ReactNode;
}

export default function ToolLayout({
    title,
    description,
    icon: Icon,
    iconColor = "#FF2D2D",
    children
}: ToolLayoutProps) {
    return (
        <AppLayout>
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <div className="flex items-center gap-4 mb-10">
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: `${iconColor}15`,
                            border: `1px solid ${iconColor}25`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 8px 20px ${iconColor}10`
                        }}
                    >
                        <Icon size={28} style={{ color: iconColor }} />
                    </div>
                    <div>
                        <h1
                            style={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: "32px",
                                color: "#fff",
                                letterSpacing: "-0.02em",
                                marginBottom: "4px"
                            }}
                        >
                            {title}
                        </h1>
                        <p style={{ color: "#606060", fontSize: "15px", fontWeight: 500 }}>
                            {description}
                        </p>
                    </div>
                </div>

                {children}
            </div>
        </AppLayout>
    );
}
