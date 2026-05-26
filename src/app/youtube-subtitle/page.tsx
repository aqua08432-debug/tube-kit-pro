"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Captions, Loader2, Download, Copy, Check, AlertCircle } from "lucide-react";

export default function YouTubeSubtitlePage() {
  const [url, setUrl] = useState(""); const [language, setLanguage] = useState("en"); const [format, setFormat] = useState("srt");
  const [includeAuto, setIncludeAuto] = useState(true); const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null); const [error, setError] = useState(""); const [copied, setCopied] = useState(false);

  async function handleFetch() {
    if (!url.trim()) return;
    setProcessing(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/subtitle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,language,format,include_auto:includeAuto})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail||data.error||"Failed");
      setResult(data);
    } catch(e:any){setError(e.message);} finally{setProcessing(false);}
  }

  function handleCopy(){if(!result)return;navigator.clipboard.writeText(result.content);setCopied(true);setTimeout(()=>setCopied(false),2000);}
  function handleDownload(){if(!result)return;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([result.content],{type:"text/plain"}));a.download=`subtitles-${Date.now()}.${format}`;a.click();}

  return (
    <AppLayout>
      <div style={{maxWidth:"800px",margin:"0 auto",padding:"40px 24px 80px"}}>
        <div className="flex items-center gap-3 mb-8">
          <div style={{width:"42px",height:"42px",borderRadius:"10px",background:"rgba(255,45,45,0.15)",border:"1px solid rgba(255,45,45,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}><Captions size={20} style={{color:"#FF2D2D"}}/></div>
          <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"26px",color:"#fff"}}>YouTube Subtitle</h1><p style={{color:"#606060",fontSize:"14px"}}>Download subtitles from any YouTube video in SRT or VTT format.</p></div>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="mb-5"><input type="text" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleFetch()} placeholder="Paste YouTube URL..." className="input-field w-full" style={{height:"50px",fontSize:"15px"}}/></div>
          <div className="flex flex-wrap gap-6 mb-5">
            <div><label style={{fontSize:"12px",color:"#606060",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Language</label>
              <select value={language} onChange={e=>setLanguage(e.target.value)} className="input-field" style={{fontSize:"13px",padding:"8px 12px",width:"auto"}}>
                {[["en","English"],["ar","Arabic"],["es","Spanish"],["fr","French"],["de","German"],["hi","Hindi"],["ja","Japanese"],["zh-Hans","Chinese"],["pt","Portuguese"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label style={{fontSize:"12px",color:"#606060",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Format</label>
              <div className="flex gap-2">{["srt","vtt"].map(f=><button key={f} onClick={()=>setFormat(f)} className="pill" style={{background:format===f?"rgba(255,45,45,0.15)":undefined,borderColor:format===f?"rgba(255,45,45,0.5)":undefined,color:format===f?"#FF2D2D":undefined}}>{f.toUpperCase()}</button>)}</div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mb-5"><input type="checkbox" checked={includeAuto} onChange={e=>setIncludeAuto(e.target.checked)} style={{accentColor:"#FF2D2D"}}/><span style={{fontSize:"13px",color:"#A0A0A0"}}>Include auto-generated captions</span></label>
          {error&&<div className="mb-4 flex items-center gap-2 p-3 rounded-lg" style={{background:"rgba(255,45,45,0.08)",border:"1px solid rgba(255,45,45,0.2)",fontSize:"13px",color:"#FF6B6B"}}><AlertCircle size={14}/>{error}</div>}
          <button onClick={handleFetch} disabled={!url||processing} className="btn-red w-full flex items-center justify-center gap-2" style={{padding:"14px",fontSize:"15px",fontWeight:700,opacity:!url?0.5:1}}>
            {processing?<><Loader2 size={16} className="animate-spin"/>Fetching...</>:"Get Subtitles"}
          </button>
        </div>

        {processing&&<div className="glass-card p-8 text-center mb-6"><Loader2 size={32} className="animate-spin mx-auto mb-4" style={{color:"#FF2D2D"}}/><p style={{color:"#A0A0A0",fontSize:"14px"}}>Fetching subtitles...</p></div>}

        {result&&(
          <div className="glass-card overflow-hidden mb-6">
            <div className="flex items-center justify-between p-4" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div><span style={{fontSize:"13px",color:"#606060"}}>Language: </span><span style={{fontSize:"13px",color:"#fff",fontWeight:500}}>{result.language}</span><span style={{fontSize:"13px",color:"#606060",marginLeft:"16px"}}>{result.entries?.length||0} segments</span></div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-ghost flex items-center gap-2" style={{padding:"7px 14px",fontSize:"12px"}}>{copied?<><Check size={12}/>Copied!</>:<><Copy size={12}/>Copy</>}</button>
                <button onClick={handleDownload} className="btn-ghost flex items-center gap-2" style={{padding:"7px 14px",fontSize:"12px"}}><Download size={12}/>Download .{format}</button>
              </div>
            </div>
            {result.available_languages?.length>0&&(
              <div className="p-4" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontSize:"12px",color:"#606060",marginBottom:"8px"}}>All available languages:</p>
                <div className="flex flex-wrap gap-2">{result.available_languages.map((l:any)=><span key={l.language_code} className="pill" style={{fontSize:"11px",background:"rgba(255,255,255,0.03)"}}>{l.language}{l.is_generated?" (auto)":""}</span>)}</div>
              </div>
            )}
            <div style={{maxHeight:"500px",overflowY:"auto",padding:"16px"}}>
              <pre style={{fontSize:"12px",color:"#C0C0C0",lineHeight:1.7,fontFamily:"monospace",whiteSpace:"pre-wrap"}}>{result.content}</pre>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
