"use client";

import AppLayout from "@/components/AppLayout";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <CheckCircle size={40} style={{ color: "#10B981" }} />
            </div>

            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "36px", color: "#fff", marginBottom: "16px" }}>
                Welcome to Pro!
            </h1>

            <p style={{ fontSize: "16px", color: "#A0A0A0", lineHeight: 1.6, marginBottom: "32px" }}>
                Your payment was successful. All premium features have been unlocked.
                Enjoy blazing fast downloads and unlimited AI generations.
            </p>

            {sessionId === "simulated_session" && (
                <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <p style={{ fontSize: "13px", color: "#F59E0B" }}>
                        Note: This was a simulated checkout because STRIPE_SECRET_KEY is not set.
                    </p>
                </div>
            )}

            <Link href="/" className="btn-red inline-flex items-center gap-2" style={{ padding: "14px 28px", fontSize: "15px", fontWeight: 600, borderRadius: "10px", textDecoration: "none" }}>
                Go to Dashboard <ArrowRight size={16} />
            </Link>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <AppLayout>
            <Suspense fallback={<div className="text-center p-20 text-gray-500">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </AppLayout>
    );
}
