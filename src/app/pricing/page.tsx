"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Check, Zap, Crown, Shield, Loader2 } from "lucide-react";

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (priceId: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
                alert("Failed to start checkout: " + data.error);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 24px 100px" }}>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "40px", color: "#fff", marginBottom: "16px" }}>
                        Simple, Transparent Pricing
                    </h1>
                    <p style={{ fontSize: "16px", color: "#A0A0A0", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
                        Upgrade to Pro to unlock 4K downloads, unlimited AI generation, and lightning-fast processing speeds.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-[800px] mx-auto">

                    {/* Free Plan */}
                    <div className="glass-card flex flex-col p-8" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="mb-6">
                            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "22px", color: "#fff", marginBottom: "8px" }}>Free</h2>
                            <p style={{ fontSize: "14px", color: "#A0A0A0" }}>Everything you need to get started.</p>
                        </div>
                        <div className="mb-6">
                            <span style={{ fontSize: "42px", fontWeight: 800, color: "#fff", fontFamily: "'Sora', sans-serif" }}>$0</span>
                            <span style={{ fontSize: "16px", color: "#606060" }}>/month</span>
                        </div>

                        <button className="btn-ghost w-full mb-8" style={{ padding: "14px", fontSize: "15px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>
                            Current Plan
                        </button>

                        <div className="flex flex-col gap-4 flex-1">
                            {[
                                "1080p Video Downloads",
                                "Basic AI Summaries",
                                "Up to 50MB PDF uploads",
                                "Standard processing speed",
                                "Ads supported"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Check size={12} style={{ color: "#fff" }} />
                                    </div>
                                    <span style={{ fontSize: "14px", color: "#D0D0D0" }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="glass-card flex flex-col p-8 relative" style={{ background: "linear-gradient(180deg, rgba(255,45,45,0.08) 0%, rgba(10,10,10,0) 100%)", border: "1px solid rgba(255,45,45,0.3)", boxShadow: "0 20px 40px rgba(255,45,45,0.1)" }}>
                        <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #FF2D2D, #FF6B35)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "4px", letterSpacing: "0.05em", boxShadow: "0 4px 10px rgba(255,45,45,0.3)" }}>
                            <Crown size={12} /> MOST POPULAR
                        </div>

                        <div className="mb-6 mt-2">
                            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "22px", color: "#fff", marginBottom: "8px" }}>Pro</h2>
                            <p style={{ fontSize: "14px", color: "#ffb4b4" }}>For serious creators and professionals.</p>
                        </div>
                        <div className="mb-6">
                            <span style={{ fontSize: "42px", fontWeight: 800, color: "#fff", fontFamily: "'Sora', sans-serif" }}>$9<span style={{ fontSize: "24px" }}>.99</span></span>
                            <span style={{ fontSize: "16px", color: "#606060" }}>/month</span>
                        </div>

                        <button
                            onClick={() => handleCheckout("price_placeholder")}
                            disabled={loading}
                            className="btn-red w-full mb-8 flex items-center justify-center gap-2"
                            style={{ padding: "14px", fontSize: "15px", fontWeight: 600, boxShadow: "0 0 20px rgba(255,45,45,0.4)" }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Upgrade to Pro <Zap size={16} fill="currentColor" /></>}
                        </button>

                        <div className="flex flex-col gap-4 flex-1">
                            {[
                                "4K / 8K Video Downloads",
                                "Unlimited AI Video Generation",
                                "Advanced AI PDF Chat (100MB+)",
                                "Maximum priority server speed",
                                "Zero Ads experience",
                                "Early access to new features"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,45,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Check size={12} style={{ color: "#FF2D2D" }} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: "14px", color: "#fff", fontWeight: 500 }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Secure Info */}
                <div className="mt-16 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                        <Shield size={18} style={{ color: "#10B981" }} />
                        <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Bank-level SSL Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="20" rx="4" fill="#635BFF" />
                            <path d="M12.9231 10.9701C12.9231 9.77607 14.1538 9.20891 15.6923 9.20891C16.8974 9.20891 17.8205 9.47756 18.2308 9.68652V7.17906C17.6154 6.94025 16.3846 6.70144 14.9744 6.70144C12.0256 6.70144 10.0256 8.22383 10.0256 11.2388C10.0256 15.5671 16.0256 15.4179 16.0256 17.5373C16.0256 18.3432 15.2821 19.3582 13.5641 19.3582C12.0256 19.3582 10.5128 18.9104 9.89743 18.5224V21.1791C10.9231 21.6268 12.359 21.8358 13.8974 21.8358C17.0769 21.8358 19.0769 20.2835 19.0769 17.2089C19.0769 12.6418 12.9231 12.9104 12.9231 10.9701Z" fill="white" />
                        </svg>
                        <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Powered by Stripe</span>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
