"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Sparkles, Loader2, Copy, FileDown, Tag, Lightbulb, AlertCircle, Check } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

export default function YouTubeSummarizerPage() {
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [style, setStyle] = useState("bullets");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState("English");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    if (!url.trim()) return;
    setProcessing(true); setResult(null); setError("");
    try {
      const res = await apiFetch("/summarize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, style, length, language }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed");
      setResult(data);
    } catch (e: any) { setError(e.message); } finally { setProcessing(false); }
  }

  function handleCopy() {
    if (!result) return;
    const text = [`# ${result.title}`, `Channel: ${result.channel} | ${result.duration}`, "", "## Summary", ...result.summary.map((s: any) => `[${s.time}] ${s.point}`), "", "## Takeaways", ...result.takeaways.map((t: string, i: number) => `${i + 1}. ${t}`), "", "## Topics", result.topics.join(", ")].join("\n");
    navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!result) return;
    const text = [`# ${result.title}`, `Channel: ${result.channel} | ${result.duration}`, "", "## Summary", ...result.summary.map((s: any) => `[${s.time}] ${s.point}`), "", "## Takeaways", ...result.takeaways.map((t: string, i: number) => `${i + 1}. ${t}`), "", "## Topics", result.topics.join(", ")].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/markdown" })); a.download = `summary-${Date.now()}.md`; a.click();
  }

  const pill = (val: string, cur: string, set: (v: string) => void) => (
    <button key={val} onClick={() => set(val)} className="pill" style={{ textTransform: "capitalize", background: cur === val ? "rgba(255,45,45,0.15)" : undefined, borderColor: cur === val ? "rgba(255,45,45,0.5)" : undefined, color: cur === val ? "#FF2D2D" : undefined }}>{val}</button>
  );

  return (
    <AppLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={20} style={{ color: "#FF2D2D" }} /></div>
          <div><h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>YouTube Summarizer</h1><p style={{ color: "#606060", fontSize: "14px" }}>AI-powered summary of any YouTube video in seconds.</p></div>
        </div>

        <div className="glass-card p-5 mb-6">
          <div className="flex gap-3 mb-4">
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSummarize()} placeholder="Paste YouTube URL..." className="input-field flex-1" style={{ height: "50px", fontSize: "15px" }} />
            <button onClick={handleSummarize} disabled={!url || processing} className="btn-red flex items-center gap-2" style={{ padding: "0 24px", height: "50px", fontWeight: 600, minWidth: "140px", opacity: !url ? 0.5 : 1 }}>
              {processing ? <><Loader2 size={15} className="animate-spin" />Processing...</> : <><Sparkles size={15} />Summarize</>}
            </button>
          </div>
          <div className="flex flex-wrap gap-5">
            <div><label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Style</label><div className="flex gap-2">{["bullets", "paragraph", "short", "detailed"].map(s => pill(s, style, setStyle))}</div></div>
            <div><label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Length</label><div className="flex gap-2">{["short", "medium", "long"].map(l => pill(l, length, setLength))}</div></div>
            <div><label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="input-field" style={{ fontSize: "13px", padding: "7px 12px", width: "auto" }}>
                {["English", "Arabic", "Spanish", "French", "German", "Hindi", "Japanese", "Chinese"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="mt-3 flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)", fontSize: "13px", color: "#FF6B6B" }}><AlertCircle size={14} />{error}</div>}
        </div>

        {processing && <div className="glass-card p-8 text-center mb-6"><Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: "#FF2D2D" }} /><p style={{ color: "#A0A0A0", fontSize: "14px" }}>Fetching transcript and generating AI summary...</p><p style={{ color: "#606060", fontSize: "12px", marginTop: "8px" }}>This may take 15–30 seconds</p></div>}

        {result && (
          <div className="glass-card overflow-hidden mb-6">
            <div className="flex gap-4 p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {result.thumbnail && <img src={result.thumbnail} alt="" style={{ width: "140px", height: "79px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />}
              <div><h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: "15px", color: "#fff", marginBottom: "4px", lineHeight: 1.4 }}>{result.title}</h2><p style={{ fontSize: "13px", color: "#606060" }}>{result.channel} · {result.duration}</p></div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}><Sparkles size={14} style={{ color: "#FF2D2D" }} />Summary</h3>
                <div className="space-y-3">{result.summary.map((item: any, i: number) => (
                  <div key={i} className="flex gap-3"><span style={{ fontSize: "11px", color: "#FF2D2D", fontFamily: "monospace", fontWeight: 600, minWidth: "38px", paddingTop: "2px" }}>{item.time}</span><p style={{ fontSize: "14px", color: "#C0C0C0", lineHeight: 1.6 }}>{item.point}</p></div>
                ))}</div>
              </div>
              {result.takeaways?.length > 0 && (
                <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(255,45,45,0.05)", border: "1px solid rgba(255,45,45,0.1)" }}>
                  <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}><Lightbulb size={14} style={{ color: "#FF2D2D" }} />Key Takeaways</h3>
                  <ol className="space-y-2">{result.takeaways.map((t: string, i: number) => (
                    <li key={i} style={{ fontSize: "14px", color: "#C0C0C0", display: "flex", gap: "10px" }}><span style={{ color: "#FF2D2D", fontWeight: 600, minWidth: "18px" }}>{i + 1}.</span>{t}</li>
                  ))}</ol>
                </div>
              )}
              {result.topics?.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}><Tag size={14} style={{ color: "#FF2D2D" }} />Topics</h3>
                  <div className="flex flex-wrap gap-2">{result.topics.map((t: string) => <span key={t} className="pill" style={{ background: "rgba(255,255,255,0.05)" }}>{t}</span>)}</div>
                </div>
              )}
              <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={handleCopy} className="btn-ghost flex items-center gap-2" style={{ padding: "9px 18px", fontSize: "13px" }}>{copied ? <><Check size={13} />Copied!</> : <><Copy size={13} />Copy</>}</button>
                <button onClick={handleDownload} className="btn-ghost flex items-center gap-2" style={{ padding: "9px 18px", fontSize: "13px" }}><FileDown size={13} />Download .md</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
