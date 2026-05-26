import AppLayout from "@/components/AppLayout";

export default function DMCAPage() {
    return (
        <AppLayout>
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "32px", color: "#fff", marginBottom: "8px" }}>DMCA Policy</h1>
                <p style={{ color: "#606060", fontSize: "14px", marginBottom: "32px" }}>Digital Millennium Copyright Act Compliance</p>

                {/* Important notice */}
                <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <p style={{ fontSize: "14px", color: "#F59E0B", fontWeight: 600, marginBottom: "8px" }}>⚠️ User Responsibility Notice</p>
                    <p style={{ fontSize: "14px", color: "#A0A0A0", lineHeight: 1.8 }}>
                        TubeKit Pro is a technical utility. <strong style={{ color: "#fff" }}>Users are solely responsible for compliance with copyright law and YouTube's Terms of Service.</strong> We do not store downloaded content on our servers. Content is processed temporarily and delivered directly to the user's device.
                    </p>
                </div>

                {[
                    { title: "Our Policy", content: "TubeKit Pro respects intellectual property rights and expects users of our service to do the same. We respond to notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA)." },
                    { title: "How We Operate", content: "TubeKit Pro functions as a technical tool that processes media upon user request. Files are not retained on our servers after delivery. We do not host, cache, or distribute copyrighted content. All processing happens in real-time and files are immediately deleted after download." },
                    { title: "Filing a DMCA Notice", content: "If you believe content processed through TubeKit Pro infringes your copyright, please send a written notice to our DMCA agent containing: (1) your contact information, (2) identification of the copyrighted work claimed to be infringed, (3) identification of the infringing material, (4) a statement of good faith belief, (5) your electronic signature." },
                    { title: "Counter-Notification", content: "If you believe your content was removed by mistake, you may submit a counter-notification. We will forward the counter-notification to the original complainant and re-enable access if no legal action is filed within 14 business days." },
                    { title: "Repeat Infringers", content: "TubeKit Pro will terminate the accounts of users who are determined to be repeat infringers of these policies." },
                ].map((section) => (
                    <div key={section.title} className="mb-8">
                        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "17px", color: "#fff", marginBottom: "10px" }}>{section.title}</h2>
                        <p style={{ fontSize: "14px", color: "#A0A0A0", lineHeight: 1.8 }}>{section.content}</p>
                    </div>
                ))}

                <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>DMCA Agent Contact</p>
                    <p style={{ fontSize: "14px", color: "#A0A0A0" }}>Email: <a href="mailto:dmca@tubekitpro.com" style={{ color: "#FF2D2D", textDecoration: "none" }}>dmca@tubekitpro.com</a></p>
                </div>
            </div>
        </AppLayout>
    );
}
