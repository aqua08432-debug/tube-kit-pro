"use client";

import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Home, ArrowLeft, Wrench } from "lucide-react";

export default function NotFound() {
    return (
        <AppLayout>
            <div style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "120px 24px",
                textAlign: "center"
            }}>
                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: "rgba(255,45,45,0.1)",
                    border: "1px solid rgba(255,45,45,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    animation: "pulseRed 2s infinite"
                }}>
                    <Wrench size={40} style={{ color: "#FF2D2D" }} />
                </div>

                <h1 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: "42px",
                    color: "#fff",
                    marginBottom: "16px",
                    letterSpacing: "-0.02em"
                }}>
                    Coming Soon
                </h1>

                <p style={{
                    fontSize: "18px",
                    color: "#606060",
                    marginBottom: "40px",
                    lineHeight: 1.6
                }}>
                    We&apos;re currently working on this tool. It will be available in the next update!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="btn-red flex items-center gap-2" style={{ padding: "12px 28px", textDecoration: "none" }}>
                        <Home size={18} /> Back to Home
                    </Link>
                    <button onClick={() => window.history.back()} className="btn-ghost flex items-center gap-2" style={{ padding: "12px 28px" }}>
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl text-left" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>50+ Tools</div>
                        <div style={{ fontSize: "12px", color: "#606060" }}>Most tools are already functional and ready to use.</div>
                    </div>
                    <div className="p-4 rounded-xl text-left" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>Pro Version</div>
                        <div style={{ fontSize: "12px", color: "#606060" }}>Get early access to all upcoming experimental tools.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
