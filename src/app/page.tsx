"use client";

import Link from "next/link";
import {
  ArrowRight, Download, Music, Sparkles, MessageSquare, FileText,
  FileEdit, LayoutTemplate, Image, ImageIcon, Zap, Shield,
  Globe, Star, Play, Search, TrendingUp, CheckCircle, Smartphone,
  Cpu, MousePointer2, Layers
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useState, useEffect } from "react";

const featuredTools = [
  { label: "Video Downloader", href: "/youtube-downloader", icon: Download, description: "Download YouTube videos in up to 4K quality instantly.", color: "#FF2D2D", badge: "Hot" },
  { label: "YouTube to MP3", href: "/youtube-to-mp3", icon: Music, description: "Extract high-quality 320kbps audio from any video.", color: "#FF6B35" },
  { label: "AI Summarizer", href: "/youtube-summarizer", icon: Sparkles, description: "Get concise, intelligent summaries of long videos.", color: "#8B5CF6", badge: "AI" },
  { label: "PDF Chat", href: "/pdf-chat", icon: MessageSquare, description: "Interact with your PDF documents using advanced AI.", color: "#06B6D4" },
  { label: "Transcript Extra", href: "/youtube-transcript", icon: FileText, description: "Instant transcription with timestamps and speaker detection.", color: "#10B981" },
  { label: "Background Remover", href: "/bg-remover", icon: Image, description: "Pro-level background removal for images in one click.", color: "#FF2D2D", badge: "New" },
  { label: "HEIC Converter", href: "/heic-converter", icon: ImageIcon, description: "Batch convert iPhone photos to high-quality JPG/PNG.", color: "#10B981" },
  { label: "Insight Cards", href: "/youtube-insight-card", icon: LayoutTemplate, description: "Generate beautiful visual cards for sharing insights.", color: "#EC4899" },
  { label: "PDF to Word", href: "/pdf-to-word", icon: FileEdit, description: "Pixel-perfect conversion from PDF to Word docs.", color: "#F59E0B" },
];

const categories = [
  { name: "YouTube Tools", count: 12, icon: Play },
  { name: "AI Utilities", count: 8, icon: Sparkles },
  { name: "PDF Suite", count: 15, icon: FileText },
  { name: "Image Tools", count: 6, icon: Image },
];

const testimonials = [
  { name: "Alex Rivers", role: "Content Creator", content: "TubeKit Pro has completely changed my workflow. The AI summarizer saves me hours every week.", avatar: "AR" },
  { name: "Sarah Chen", role: "Student", content: "The PDF-to-Notes feature is a lifesaver for studying. Everything is so clean and fast.", avatar: "SC" },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppLayout>
      <div className="relative overflow-hidden">
        {/* Abstract Background Decorations */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

          {/* Hero Section */}
          <section className="pt-24 pb-20 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">Trusted by 2M+ users worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              The Ultimate <span className="gradient-text">YouTube</span> & <br />
              <span className="text-white">AI Utility Hub.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Download, summarize, convert, and analyze YouTube videos and documents with pro-grade tools. Fast, free, and no sign-up required.
            </p>

            {/* Premium Input Bar */}
            <div className="max-w-3xl mx-auto mb-16 px-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-[#0D0D0D] border border-white/10 rounded-[20px] p-2 pr-2 shadow-2xl">
                  <div className="pl-5 pr-2">
                    <Search className="text-gray-500" size={20} />
                  </div>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter YouTube URL or search tools..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white text-lg py-4 placeholder:text-gray-600 outline-none"
                  />
                  <Link href={`/youtube-downloader?url=${encodeURIComponent(urlInput)}`}
                    className="btn-red hidden md:flex items-center gap-2 px-8 py-4 rounded-[14px] font-bold text-base">
                    Get Started <ArrowRight size={18} />
                  </Link>
                  <button className="md:hidden p-4 bg-red-600 rounded-xl text-white" title="Get Started">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
                <span className="text-xs font-medium text-gray-500">POPULAR:</span>
                {["Summarizer", "MP3 Converter", "Background Remover", "PDF Chat"].map(tag => (
                  <Link key={tag} href="#" className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-red-500/50 transition-all">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Categories */}
          <section className="mb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.name} className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
                      <Icon className="text-white group-hover:text-red-500 transition-colors" size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{cat.count} Professional Tools</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Main Tools Grid */}
          <section className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Most Popular Tools
                </h2>
                <div className="h-1.5 w-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full" />
              </div>
              <Link href="/youtube-downloader" className="group text-gray-400 flex items-center gap-2 hover:text-red-500 transition-colors">
                Explore all 50+ tools
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600/10 transition-colors">
                  <ArrowRight size={14} />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <Link key={idx} href={tool.href} className="glass-card group p-1 overflow-hidden transition-all hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                          style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}>
                          <Icon size={26} style={{ color: tool.color }} />
                          <div className="absolute -inset-2 bg-[white]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {tool.badge && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{tool.label}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                        LAUNCH TOOL <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Stats & Trust */}
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                  High-Performance Processing <br />
                  <span className="text-gray-500">Built for Creators.</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Military-Grade Security", desc: "All files are processed using AES-256 encryption and deleted within 24 hours.", icon: Shield },
                    { title: "Lightning Fast API", desc: "Our global server network ensures your downloads and summaries happen in seconds.", icon: Zap },
                    { title: "Cross-Platform Access", desc: "Use TubeKit Pro on any device — Mobile, Tablet, or Desktop.", icon: Globe },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <item.icon className="text-red-500" size={22} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-white/10 p-1">
                  <div className="w-full h-full bg-[#0D0D0D] rounded-[30px] p-8 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-8">
                      {[
                        { label: "Files Processed", value: "14M+", icon: TrendingUp },
                        { label: "Global Users", value: "2.5M", icon: Globe },
                        { label: "Server Uptime", value: "99.9%", icon: Cpu },
                        { label: "Average Rating", value: "4.9/5", icon: Star },
                      ].map((stat, i) => (
                        <div key={i}>
                          <stat.icon className="text-red-500 mb-2" size={20} />
                          <div className="text-3xl font-black text-white">{stat.value}</div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Decorative floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-600/30 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl" />
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="pb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
              <p className="text-gray-500">Loved by millions of creators and professionals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t, idx) => (
                <div key={idx} className="glass-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-400 italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}
