import AppLayout from "@/components/AppLayout";
import { Zap, Shield, Globe, Star, Users, Code } from "lucide-react";

export default function AboutPage() {
    return (
        <AppLayout>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="tk-logo mx-auto mb-4" style={{ width: "64px", height: "64px", fontSize: "20px" }}>TK</div>
                    <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "36px", color: "#fff", marginBottom: "12px" }}>
                        About TubeKit Pro
                    </h1>
                    <p style={{ fontSize: "17px", color: "#A0A0A0", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
                        Every YouTube tool, AI summarizer, and PDF utility — built for creators, students, and professionals worldwide.
                    </p>
                </div>

                {/* Mission */}
                <div className="glass-card p-8 mb-12">
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "22px", color: "#fff", marginBottom: "16px" }}>Our Mission</h2>
                    <p style={{ fontSize: "16px", color: "#A0A0A0", lineHeight: 1.8 }}>
                        TubeKit Pro was built with one goal: to give everyone access to powerful media tools without friction. No account required, no paywalls on basic features, no learning curve. Just paste a URL and get what you need.
                    </p>
                    <p style={{ fontSize: "16px", color: "#A0A0A0", lineHeight: 1.8, marginTop: "12px" }}>
                        We believe in the power of open, accessible tools — so we built TubeKit Pro as the most comprehensive all-in-one platform for YouTube utilities, AI content processing, and document conversion.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {[
                        { icon: Users, value: "14M+", label: "Files Processed", color: "#FF2D2D" },
                        { icon: Globe, value: "190+", label: "Countries Served", color: "#06B6D4" },
                        { icon: Code, value: "50+", label: "Free Tools", color: "#8B5CF6" },
                    ].map(({ icon: Icon, value, label, color }) => (
                        <div key={label} className="glass-card p-6 text-center">
                            <Icon size={24} style={{ color, margin: "0 auto 12px" }} />
                            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "28px", color: "#fff", marginBottom: "4px" }}>{value}</p>
                            <p style={{ fontSize: "13px", color: "#606060" }}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* Values */}
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "22px", color: "#fff", marginBottom: "16px" }}>Our Values</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: Zap, title: "Speed First", desc: "We obsess over performance. Every tool is optimized for the fastest possible output.", color: "#FF6B35" },
                        { icon: Shield, title: "Privacy-Focused", desc: "Files are deleted within 24 hours. We never train AI on your data.", color: "#10B981" },
                        { icon: Globe, title: "Globally Accessible", desc: "Our tools work in 190+ countries in multiple languages.", color: "#06B6D4" },
                        { icon: Star, title: "Quality Output", desc: "We compete with paid tools. Our outputs are professional-grade every time.", color: "#F59E0B" },
                    ].map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="glass-card p-5 flex gap-4">
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={18} style={{ color }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{title}</h3>
                                <p style={{ fontSize: "13px", color: "#606060", lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
