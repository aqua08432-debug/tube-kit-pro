import AppLayout from "@/components/AppLayout";

export default function TermsPage() {
    return (
        <AppLayout>
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "32px", color: "#fff", marginBottom: "8px" }}>Terms of Service</h1>
                <p style={{ color: "#606060", fontSize: "14px", marginBottom: "32px" }}>Last updated: April 24, 2024</p>

                {[
                    { title: "1. Acceptance of Terms", content: "By accessing or using TubeKit Pro, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service." },
                    { title: "2. Use of Service", content: "TubeKit Pro provides tools for processing and converting media files. You are solely responsible for ensuring that your use of our service complies with all applicable laws and third-party terms of service, including YouTube's Terms of Service." },
                    { title: "3. Prohibited Use", content: "You may not use TubeKit Pro to download, convert, or process copyrighted content without proper authorization. Commercial redistribution of downloaded content is strictly prohibited. You must comply with all applicable intellectual property laws." },
                    { title: "4. Data & Privacy", content: "Files you upload are processed temporarily and automatically deleted within 24 hours. We do not store file contents after deletion. Please refer to our Privacy Policy for complete information about data handling." },
                    { title: "5. Liability Limitation", content: "TubeKit Pro is provided 'as is' without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to data loss, service interruptions, or copyright infringement." },
                    { title: "6. Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms." },
                ].map((section) => (
                    <div key={section.title} className="mb-8">
                        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "17px", color: "#fff", marginBottom: "10px" }}>{section.title}</h2>
                        <p style={{ fontSize: "14px", color: "#A0A0A0", lineHeight: 1.8 }}>{section.content}</p>
                    </div>
                ))}

                <div className="mt-8 p-5 rounded-xl" style={{ background: "rgba(255,45,45,0.05)", border: "1px solid rgba(255,45,45,0.1)" }}>
                    <p style={{ fontSize: "14px", color: "#A0A0A0", lineHeight: 1.8 }}>
                        Questions? Contact us at{" "}
                        <a href="mailto:legal@tubkitpro.com" style={{ color: "#FF2D2D", textDecoration: "none" }}>legal@tubekitpro.com</a>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
