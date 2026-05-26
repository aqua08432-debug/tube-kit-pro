"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { FileText, Loader2, Copy, Download, Search, Check, AlertCircle } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

export default function YouTubeTranscriptPage() {
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [format, setFormat] = useState("timestamps");
  const [language, setLanguage] = useState("en");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  async function handleFetch() {
    if (!url.trim()) return;
    setProcessing(true); setResult(null); setError("");
    try {
      const res = await apiFetch("/transcript", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, language, format }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed");
      setResult(data);
    } catch (e: any) { setError(e.message); } finally { setProcessing(false); }
  }

  function handleCopy() { if (!result) return; navigator.clipboard.writeText(result.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  function handleDownload() {
    if (!result) return;
    const ext = format === "srt" ? "srt" : format === "vtt" ? "vtt" : "txt";
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([result.content], { type: "text/plain" })); a.download = `transcript-${Date.now()}.${ext}`; a.click();
  }

  const filtered = result?.entries?.filter((e: any) => !search || e.text?.toLowerCase().includes(search.toLowerCase())) || [];
  const fmts = [["timestamps", "With Timestamps"], ["text", "Plain Text"], ["srt", "SRT"], ["vtt", "VTT"]];

  return (
    <AppLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={20} style={{ color: "#FF2D2D" }} /></div>
          <div><h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>YouTube Transcript</h1><p style={{ color: "#606060", fontSize: "14px" }}>Extract full transcript with timestamps from any YouTube video.</p></div>
        </div>

        <div className="glass-card p-5 mb-6">
          <div className="flex gap-3 mb-4">
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleFetch()} placeholder="Paste YouTube URL..." className="input-field flex-1" style={{ height: "50px", fontSize: "15px" }} />
            <button onClick={handleFetch} disabled={!url || processing} className="btn-red flex items-center gap-2" style={{ padding: "0 24px", height: "50px", fontWeight: 600, minWidth: "160px", opacity: !url ? 0.5 : 1 }}>
              {processing ? <><Loader2 size={15} className="animate-spin" />Fetching...</> : <><FileText size={15} />Get Transcript</>}
            </button>
          </div>
          <div className="flex flex-wrap gap-5">
            <div><label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Format</label>
              <div className="flex gap-2">{fmts.map(([val, label]) => <button key={val} onClick={() => setFormat(val)} className="pill" style={{ background: format === val ? "rgba(255,45,45,0.15)" : undefined, borderColor: format === val ? "rgba(255,45,45,0.5)" : undefined, color: format === val ? "#FF2D2D" : undefined }}>{label}</button>)}</div>
            </div>
            <div><label style={{ fontSize: "11px", color: "#606060", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="input-field" style={{ fontSize: "13px", padding: "7px 12px", width: "auto" }}>
                {[["en", "English"], ["ar", "Arabic"], ["es", "Spanish"], ["fr", "French"], ["de", "German"], ["hi", "Hindi"], ["ja", "Japanese"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="mt-3 flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)", fontSize: "13px", color: "#FF6B6B" }}><AlertCircle size={14} />{error}</div>}
        </div>

        {processing && <div className="glass-card p-8 text-center mb-6"><Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: "#FF2D2D" }} /><p style={{ color: "#A0A0A0", fontSize: "14px" }}>Fetching transcript...</p></div>}

        {result && (
          <div className="glass-card overflow-hidden mb-6">
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div><span style={{ fontSize: "13px", color: "#606060" }}>Language: </span><span style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{result.language}</span><span style={{ fontSize: "13px", color: "#606060", marginLeft: "16px" }}>{result.entries?.length || 0} segments</span></div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-ghost flex items-center gap-2" style={{ padding: "7px 14px", fontSize: "12px" }}>{copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy All</>}</button>
                <button onClick={handleDownload} className="btn-ghost flex items-center gap-2" style={{ padding: "7px 14px", fontSize: "12px" }}><Download size={12} />Download</button>
              </div>
            </div>
            {format === "timestamps" && (
              <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#606060" }} /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search within transcript..." className="input-field" style={{ paddingLeft: "34px", fontSize: "13px", padding: "8px 12px 8px 34px" }} /></div>
              </div>
            )}
            <div style={{ maxHeight: "500px", overflowY: "auto", padding: "16px" }}>
              {format === "timestamps" ? (
                <div className="space-y-2">
                  {(search ? filtered : result.entries).map((e: any, i: number) => (
                    <div key={i} className="flex gap-3 py-1 px-2 rounded hover:bg-white/5">
                      <span style={{ fontSize: "12px", color: "#FF2D2D", fontFamily: "monospace", fontWeight: 600, minWidth: "42px", paddingTop: "2px" }}>{e.time}</span>
                      <span style={{ fontSize: "13px", color: "#C0C0C0", lineHeight: 1.6 }}>
                        {search ? e.text.split(new RegExp(`(${search})`, "gi")).map((p: string, j: number) => p.toLowerCase() === search.toLowerCase() ? <mark key={j} style={{ background: "rgba(255,45,45,0.3)", color: "#fff", borderRadius: "2px" }}>{p}</mark> : p) : e.text}
                      </span>
                    </div>
                  ))}
                  {search && filtered.length === 0 && <p style={{ fontSize: "13px", color: "#606060", textAlign: "center", padding: "20px" }}>No results for &quot;{search}&quot;</p>}
                </div>
              ) : (
                <pre style={{ fontSize: "12px", color: "#C0C0C0", lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.content}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
