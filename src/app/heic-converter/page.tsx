"use client";
import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Upload, Download, X, Loader2, AlertCircle, CheckCircle, FileImage, Package } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

type ConvertedFile = { original: string; filename: string; image: string; success: boolean; error?: string };
type OutputFormat = "jpeg" | "png" | "webp";

export default function HeicConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [quality, setQuality] = useState(90);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(newFiles: FileList | File[]) {
    const arr = Array.from(newFiles).filter(f =>
      f.name.toLowerCase().match(/\.(heic|heif|jpg|jpeg|png|webp|bmp|tiff|tif)$/)
    );
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...arr.filter(f => !names.has(f.name))];
    });
  }

  function removeFile(i: number) { setFiles(f => f.filter((_, idx) => idx !== i)); }

  async function handleConvert() {
    if (!files.length) return;
    setProcessing(true); setResults([]); setError("");
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("files", f));
      fd.append("output_format", format);
      fd.append("quality", String(quality));
      const res = await apiFetch("/api/convert-heic", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Conversion failed");
      setResults(data.results || []);
    } catch (e: any) { setError(e.message); } finally { setProcessing(false); }
  }

  function downloadSingle(r: ConvertedFile) {
    const a = document.createElement("a");
    a.href = `data:image/${format === "jpeg" ? "jpeg" : format};base64,${r.image}`;
    a.download = r.filename; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  async function downloadAll() {
    // Download as ZIP using JSZip from CDN
    try {
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new (JSZip as any)();
      results.filter(r => r.success).forEach(r => {
        const b64 = r.image; zip.file(r.filename, b64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `converted-${Date.now()}.zip`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch {
      // Fallback: download one by one
      results.filter(r => r.success).forEach(r => downloadSingle(r));
    }
  }

  function handleReset() { setFiles([]); setResults([]); setError(""); }

  const successCount = results.filter(r => r.success).length;

  return (
    <AppLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,45,45,0.15)", border: "1px solid rgba(255,45,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileImage size={20} style={{ color: "#FF2D2D" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "26px", color: "#fff" }}>HEIC Converter</h1>
            <p style={{ color: "#606060", fontSize: "14px" }}>Convert HEIC/HEIF photos to JPG, PNG, or WebP — single files or batch with ZIP download.</p>
          </div>
        </div>

        {/* Options */}
        <div className="glass-card p-5 mb-5">
          <div className="flex flex-wrap gap-6">
            <div>
              <label style={{ fontSize: "12px", color: "#606060", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Output Format</label>
              <div className="flex gap-2">
                {(["jpeg", "png", "webp"] as OutputFormat[]).map(f => (
                  <button key={f} onClick={() => setFormat(f)} className="pill" style={{ background: format === f ? "rgba(255,45,45,0.15)" : undefined, borderColor: format === f ? "rgba(255,45,45,0.5)" : undefined, color: format === f ? "#FF2D2D" : undefined, textTransform: "uppercase" }}>
                    {f === "jpeg" ? "JPG" : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {format !== "png" && (
              <div>
                <label style={{ fontSize: "12px", color: "#606060", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quality: {quality}%</label>
                <input type="range" min={50} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} style={{ width: "160px", accentColor: "#FF2D2D" }} />
              </div>
            )}
          </div>
        </div>

        {/* Upload */}
        {results.length === 0 && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
            onClick={() => inputRef.current?.click()}
            className={`upload-zone ${dragging ? "dragging" : ""}`}
            style={{ padding: "48px 40px", cursor: "pointer", marginBottom: "16px" }}
          >
            <input ref={inputRef} type="file" accept=".heic,.heif,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif" multiple onChange={e => { if (e.target.files) addFiles(e.target.files) }} style={{ display: "none" }} />
            <div className="flex flex-col items-center gap-4">
              <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "rgba(255,45,45,0.1)", border: "1px solid rgba(255,45,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Upload size={26} style={{ color: "#FF2D2D" }} />
              </div>
              <div className="text-center">
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Drop HEIC/HEIF files here</p>
                <p style={{ fontSize: "13px", color: "#606060" }}>or click to browse · supports multiple files · also accepts JPG, PNG, WebP</p>
              </div>
            </div>
          </div>
        )}

        {/* File list */}
        {files.length > 0 && results.length === 0 && (
          <div className="glass-card p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: "13px", color: "#A0A0A0", fontWeight: 500 }}>{files.length} file{files.length !== 1 ? "s" : ""} selected</span>
              <button onClick={() => inputRef.current?.click()} className="btn-ghost" style={{ padding: "6px 14px", fontSize: "12px" }}>+ Add More</button>
            </div>
            <div style={{ maxHeight: "280px", overflowY: "auto" }} className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <FileImage size={16} style={{ color: "#FF2D2D", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#fff", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                  <span style={{ fontSize: "11px", color: "#606060", flexShrink: 0 }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button onClick={() => removeFile(i)} style={{ color: "#606060", cursor: "pointer", flexShrink: 0, background: "none", border: "none", padding: "2px" }}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="mb-4 flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(255,45,45,0.08)", border: "1px solid rgba(255,45,45,0.2)", fontSize: "13px", color: "#FF6B6B" }}><AlertCircle size={14} />{error}</div>}

        {/* Convert button */}
        {files.length > 0 && results.length === 0 && (
          <button onClick={handleConvert} disabled={processing} className="btn-red w-full flex items-center justify-center gap-2" style={{ padding: "14px", fontSize: "15px", fontWeight: 700 }}>
            {processing ? <><Loader2 size={16} className="animate-spin" />Converting {files.length} file{files.length !== 1 ? "s" : ""}...</> : <><FileImage size={16} />Convert to {format === "jpeg" ? "JPG" : format.toUpperCase()}</>}
          </button>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            {/* Summary bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} style={{ color: "#10B981" }} />
                <span style={{ fontSize: "14px", color: "#fff", fontWeight: 500 }}>{successCount} of {results.length} converted</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={handleReset} className="btn-ghost flex items-center gap-2" style={{ padding: "9px 16px", fontSize: "13px" }}><Upload size={13} />Convert More</button>
                {successCount > 1 && <button onClick={downloadAll} className="btn-ghost flex items-center gap-2" style={{ padding: "9px 16px", fontSize: "13px" }}><Package size={13} />Download All as ZIP</button>}
                {successCount === 1 && <button onClick={() => downloadSingle(results.find(r => r.success)!)} className="btn-red flex items-center gap-2" style={{ padding: "9px 18px", fontSize: "13px", fontWeight: 600 }}><Download size={13} />Download</button>}
                {successCount > 1 && <button onClick={() => results.filter(r => r.success).forEach(r => downloadSingle(r))} className="btn-red flex items-center gap-2" style={{ padding: "9px 18px", fontSize: "13px", fontWeight: 600 }}><Download size={13} />Download All Separately</button>}
              </div>
            </div>

            {/* File grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "16px" }}>
              {results.map((r, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  {r.success ? (
                    <>
                      <div style={{ background: "repeating-conic-gradient(#1a1a1a 0% 25%, #222 0% 50%)", backgroundSize: "16px 16px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                        <img src={`data:image/${format === "jpeg" ? "jpeg" : format};base64,${r.image}`} alt={r.filename} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "4px" }} />
                      </div>
                      <div className="p-3">
                        <p style={{ fontSize: "12px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "8px" }} title={r.filename}>{r.filename}</p>
                        <button onClick={() => downloadSingle(r)} className="btn-red w-full flex items-center justify-center gap-1" style={{ padding: "7px", fontSize: "12px", fontWeight: 600 }}>
                          <Download size={12} />Download
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 flex flex-col items-center gap-2 text-center" style={{ height: "220px", justifyContent: "center" }}>
                      <AlertCircle size={24} style={{ color: "#FF2D2D" }} />
                      <p style={{ fontSize: "12px", color: "#FF6B6B" }}>{r.original}</p>
                      <p style={{ fontSize: "11px", color: "#606060" }}>{r.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[{ icon: "📱", t: "iPhone Photos", d: "Directly convert HEIC files from iPhone & iPad." }, { icon: "📦", t: "Batch Convert", d: "Upload unlimited files. Download individually or as ZIP." }, { icon: "🎨", t: "Quality Control", d: "Set output quality from 50–100% for JPG and WebP." }].map(c => (
            <div key={c.t} className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{c.t}</div>
              <div style={{ fontSize: "12px", color: "#606060", lineHeight: 1.5 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
