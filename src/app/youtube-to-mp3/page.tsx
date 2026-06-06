"use client";
import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Music, Search, Loader2, Download, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { apiFetch, startDownloadAndPoll, saveFile } from "@/lib/config";

export default function YouTubeToMP3Page() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string|null>(null);
  const [filename, setFilename] = useState<string|null>(null);
  const [done, setDone] = useState(false);
  const [bitrate, setBitrate] = useState("320");
  const didAutoLoad = useRef(false);

  useEffect(() => {
    if (didAutoLoad.current) return;
    const p = new URLSearchParams(window.location.search).get("url") || "";
    if (p) { didAutoLoad.current = true; setUrl(p); setTimeout(() => analyze(p), 100); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function analyze(u?: string) {
    const target = u || url;
    if (!target) return;
    setLoading(true); setError(""); setVideoInfo(null); setDone(false);
    try {
      const res = await apiFetch("/analyze", { method:"POST", body:JSON.stringify({ url:target }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to analyze");
      setVideoInfo(data);
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleConvert() {
    setError(""); setProgress(5); setDone(false);
    try {
      const { jobId: id, filename: fn } = await startDownloadAndPoll(
        { url, type:"audio", audio_format:"mp3", audio_quality:bitrate },
        setProgress
      );
      setJobId(id); setFilename(fn); setDone(true);
    } catch (e:any) { setError(e.message); setProgress(0); }
  }

  function handleSave() { if (jobId && filename) saveFile(jobId, filename); }

  function reset() {
    setUrl(""); setVideoInfo(null); setDone(false);
    setProgress(0); setJobId(null); setFilename(null); setError("");
    window.history.replaceState({}, "", window.location.pathname);
  }

  return (
    <AppLayout>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 24px 80px" }}>
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width:42,height:42,borderRadius:10,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.25)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Music size={20} style={{ color:"#FF6B35" }}/>
          </div>
          <div>
            <h1 style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:26,color:"#fff" }}>YouTube to MP3</h1>
            <p style={{ color:"#606060",fontSize:14 }}>Convert any YouTube video to high-quality MP3 audio.</p>
          </div>
        </div>

        <div className="glass-card p-5 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:"#606060" }}/>
              <input type="text" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}
                placeholder="Paste YouTube URL…" className="input-field" style={{ paddingLeft:44,fontSize:15,height:52 }}/>
            </div>
            <button onClick={()=>analyze()} disabled={!url||loading} className="btn-red flex items-center gap-2"
              style={{ padding:"0 24px",height:52,fontWeight:600,minWidth:120 }}>
              {loading?<><Loader2 size={16} className="animate-spin"/>Analyzing…</>:<><Search size={16}/>Analyze</>}
            </button>
          </div>
          {error && <div className="mt-3 flex items-center gap-2 p-3 rounded-lg" style={{ background:"rgba(255,45,45,0.08)",border:"1px solid rgba(255,45,45,0.2)",fontSize:13,color:"#FF6B6B" }}><AlertCircle size={14}/>{error}</div>}
        </div>

        {videoInfo && !done && (
          <div className="glass-card p-6 mb-6" style={{ animation:"slideUp 0.3s ease-out" }}>
            <div className="flex gap-4 mb-6">
              <img src={videoInfo.thumbnail} alt="" style={{ width:160,height:90,objectFit:"cover",borderRadius:8 }}/>
              <div>
                <h2 style={{ fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:17,color:"#fff",marginBottom:6,lineHeight:1.4 }}>{videoInfo.title}</h2>
                <p style={{ color:"#606060",fontSize:13 }}>{videoInfo.channel} · {videoInfo.duration}</p>
              </div>
            </div>

            <div className="mb-5">
              <label style={{ fontSize:12,color:"#606060",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,display:"block" }}>Bitrate</label>
              <div className="flex gap-2">
                {["320","256","192","128"].map(b=>(
                  <button key={b} onClick={()=>setBitrate(b)} className="pill"
                    style={{ background:bitrate===b?"rgba(255,107,53,0.15)":undefined,borderColor:bitrate===b?"rgba(255,107,53,0.5)":undefined,color:bitrate===b?"#FF6B35":undefined }}>
                    {b} kbps
                  </button>
                ))}
              </div>
            </div>

            {progress>0 && progress<100 && (
              <div className="mb-5">
                <div className="flex justify-between mb-2" style={{ fontSize:13,color:"#A0A0A0" }}>
                  <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin"/>Converting…</span>
                  <span style={{ fontFamily:"monospace",color:"#fff" }}>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%`,transition:"width 0.5s ease" }}/></div>
              </div>
            )}

            <button onClick={handleConvert} disabled={progress>0&&progress<100} className="btn-red flex items-center justify-center gap-2 w-full"
              style={{ padding:14,fontSize:15,fontWeight:700,opacity:progress>0&&progress<100?0.5:1 }}>
              <Music size={17}/>{progress>0&&progress<100?"Converting…":"Convert to MP3"}
            </button>
          </div>
        )}

        {done && (
          <div className="glass-card p-8 text-center" style={{ animation:"slideUp 0.3s ease-out" }}>
            <div style={{ width:64,height:64,borderRadius:"50%",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
              <CheckCircle size={32} style={{ color:"#10B981" }}/>
            </div>
            <h2 style={{ fontSize:22,fontWeight:700,color:"#fff",marginBottom:8 }}>MP3 Ready!</h2>
            <p style={{ color:"#606060",marginBottom:24,fontSize:14 }}>{filename}</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleSave} className="btn-red flex items-center gap-2" style={{ padding:"12px 28px",fontWeight:700 }}>
                <Download size={17}/>Save MP3
              </button>
              <button onClick={reset} className="btn-ghost flex items-center gap-2" style={{ padding:"12px 20px" }}>
                <RefreshCw size={15}/>Convert Another
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
