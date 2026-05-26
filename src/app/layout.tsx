import type { Metadata } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-sora" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dm-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "TubeKit Pro — Every YouTube Tool You'll Ever Need",
  description:
    "TubeKit Pro: YouTube video downloader, AI summarizer, transcript extractor, MP3 converter, PDF tools, AI image & video generator — all in one premium platform.",
  keywords:
    "YouTube downloader, YouTube summarizer, YouTube transcript, MP3 converter, PDF tools, AI summarizer",
  openGraph: {
    title: "TubeKit Pro",
    description: "Every YouTube tool, AI summarizer, and PDF utility — in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body style={{ background: "#0A0A0A", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
