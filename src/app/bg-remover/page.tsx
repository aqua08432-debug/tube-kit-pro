"use client";
import { useState, useRef, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Upload, Download, RefreshCw, Loader2, AlertCircle, CheckCircle, ImageIcon } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

export default function BgRemoverPage() {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<"split" | "original" | "result">("split");
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please upload an image file (PNG, JPG, WebP, etc.)"); return; }
    setError(""); setResult(null); setProcessing(true);
    setOriginal(URL.createObjectURL(file));
    setFilename(file.name.replace(/\.[^.]+$/, "") + "_no_bg.png");

    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await apiFetch("/api/remove-background", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.detail || data.error || "Failed");
      setResult(`data:image/png;base64,${data.image}`);
    } catch (e: any) { setError(e.message); } finally { setProcessing(false); }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0]; if (file) processFile(file);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (file) processFile(file);
  }

  function handleDownload() {
    if (!result) return;
    const a = document.createElement("a"); a.href = result; a.download = filename || "image_no_bg.png";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function handleReset() { setOriginal(null); setResult(null); setError(""); setFilename(null); setProcessing(false); }

  return (
    <AppLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={20} style={{ color: "#FF2D2D" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>Background Remover</h1>
            <p style={{ color: "#606060", fontSize: "14px" }}>Remove image backgrounds instantly — free, local, no API key needed. Powered by <strong style={{ color: "#A0A0A0" }}>rembg</strong>.</p>
          </div>
        </div>

        {/* Upload Zone */}
        {!original && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`upload-zone ${dragging ? "dragging" : ""}`}
            style={{ padding: "60px 40px", cursor: "pointer" }}
          >
            <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            <div className="flex flex-col items-center gap-4">
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(255,45,45,0.1)", border: "1px solid rgba(255,45,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Upload size={28} style={{ color: "#FF2D2D" }} />
              </div>
              <div className="text-center">
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Drop your image here</p>
                <p style={{ fontSize: "13px", color: "#606060" }}>or click to browse · PNG, JPG, WebP, BMP, TIFF supported</p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                {["PNG", "JPG", "WebP", "BMP", "TIFF"].map(f => <span key={f} className="pill" style={{ fontSize: "11px", cursor: "default" }}>{f}</span>)}
              </div>
            </div>
          </div>
        )}

        {error && <div className="mt-4 flex items-center gap-2 p-4 rounded-xl" style={{ background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)", fontSize: "13px", color: "#FF6B6B" }}><AlertCircle size={16} />{error}<button onClick={handleReset} style={{ marginLeft: "auto", color: "#FF2D2D", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>Try again</button></div>}

        {/* Processing */}
        {processing && original && (
          <div className="glass-card p-8 text-center mt-6">
            <Loader2 size={36} className="animate-spin mx-auto mb-4" style={{ color: "#FF2D2D" }} />
            <p style={{ color: "#fff", fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>Removing background...</p>
            <p style={{ color: "#606060", fontSize: "13px" }}>Using AI model locally — this takes 5–15 seconds</p>
          </div>
        )}

        {/* Result */}
        {result && original && !processing && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex gap-2">
                {(["split", "original", "result"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} className="pill" style={{ textTransform: "capitalize", background: view === v ? "rgba(255,45,45,0.15)" : undefined, borderColor: view === v ? "rgba(255,45,45,0.5)" : undefined, color: view === v ? "#FF2D2D" : undefined }}>{v}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={handleReset} className="btn-ghost flex items-center gap-2" style={{ padding: "9px 18px", fontSize: "13px" }}><RefreshCw size={14} />New Image</button>
                <button onClick={handleDownload} className="btn-red flex items-center gap-2" style={{ padding: "9px 20px", fontSize: "13px", fontWeight: 600 }}><Download size={14} />Download PNG</button>
              </div>
            </div>

            {/* Image viewer */}
            <div className="glass-card overflow-hidden">
              {view === "split" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ background: "#111", padding: "16px" }}>
                    <p style={{ fontSize: "11px", color: "#606060", marginBottom: "8px", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>Original</p>
                    <img src={original} alt="Original" style={{ width: "100%", height: "auto", maxHeight: "500px", objectFit: "contain", borderRadius: "8px" }} />
                  </div>
                  <div style={{ padding: "16px", backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #222 0% 50%)", backgroundSize: "20px 20px" }}>
                    <p style={{ fontSize: "11px", color: "#606060", marginBottom: "8px", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>Background Removed</p>
                    <img src={result} alt="Result" style={{ width: "100%", height: "auto", maxHeight: "500px", objectFit: "contain", borderRadius: "8px" }} />
                  </div>
                </div>
              ) : view === "original" ? (
                <div style={{ background: "#111", padding: "24px", textAlign: "center" }}>
                  <img src={original} alt="Original" style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain", borderRadius: "8px" }} />
                </div>
              ) : (
                <div style={{ padding: "24px", backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #222 0% 50%)", backgroundSize: "20px 20px", textAlign: "center" }}>
                  <img src={result} alt="No background" style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain", borderRadius: "8px" }} />
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <CheckCircle size={16} style={{ color: "#10B981", flexShrink: 0 }} />
              <p style={{ fontSize: "13px", color: "#10B981" }}>Background removed successfully! Click <strong>Download PNG</strong> to save with transparent background.</p>
            </div>
          </>
        )}

        {/* Info */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[{ icon: "🔒", t: "100% Private", d: "Image is processed locally on your server. Never uploaded to any third party." }, { icon: "⚡", t: "Fast & Free", d: "Powered by rembg (open-source AI). No credits, no limits." }, { icon: "🎯", t: "High Quality", d: "U2Net AI model gives clean edges even on complex images." }].map(c => (
            <div key={c.t} className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{c.t}</div>
              <div style={{ fontSize: "12px", color: "#606060", lineHeight: 1.5 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
