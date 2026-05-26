import AppLayout from "@/components/AppLayout";

export default function PrivacyPage() {
    return (
        <AppLayout>
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "32px", color: "#fff", marginBottom: "8px" }}>Privacy Policy</h1>
                <p style={{ color: "#606060", fontSize: "14px", marginBottom: "32px" }}>Last updated: April 24, 2024</p>

                {[
                    { title: "Data We Collect", content: "We collect minimal data to operate our service: (1) uploaded files — processed temporarily and deleted within 24 hours, (2) usage analytics — anonymized page views and feature usage, (3) account information (if you create an account) — email and encrypted password." },
                    { title: "How We Use Your Data", content: "Uploaded files are only used to perform the requested conversion/processing and are never used to train AI models, stored beyond the 24-hour window, or shared with third parties. Usage data helps us improve the service." },
                    { title: "Cookies", content: "We use essential cookies for service functionality and optional analytics cookies (with your consent) to understand how users interact with TubeKit Pro." },
                    { title: "Third-Party Services", content: "We use trusted third-party services including: Anthropic (AI processing, no data retention), cloud infrastructure providers (processing only), and analytics services (anonymized data only)." },
                    { title: "Your Rights", content: "You have the right to: access your data, request deletion of your account and data, opt out of analytics, and receive a copy of your data. Contact us at privacy@tubekitpro.com." },
                    { title: "Security", content: "All file transfers use HTTPS/TLS 1.3 encryption. Files at rest are encrypted with AES-256. We follow OWASP security best practices and conduct regular security audits." },
                    { title: "Children's Privacy", content: "TubeKit Pro is not directed to children under 13. We do not knowingly collect personal information from children." },
                ].map((section) => (
                    <div key={section.title} className="mb-8">
                        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "17px", color: "#fff", marginBottom: "10px" }}>{section.title}</h2>
                        <p style={{ fontSize: "14px", color: "#A0A0A0", lineHeight: 1.8 }}>{section.content}</p>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
