"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { BookOpen, Loader2, Copy, Download, Check, AlertCircle } from "lucide-react";

const STYLES: Record<string,{label:string;icon:string;desc:string}> = {
  study:{label:"Study Notes",icon:"📚",desc:"Sections, definitions & concepts"},
  meeting:{label:"Meeting Notes",icon:"💼",desc:"Agenda, points & action items"},
  outline:{label:"Blog Outline",icon:"✍️",desc:"Hierarchical headers"},
  action:{label:"Action Items",icon:"✅",desc:"Tasks and next steps"},
  mindmap:{label:"Mind Map",icon:"🧠",desc:"Central topic with branches"},
};

export default function YouTubeToNotesPage() {
  const [url, setUrl] = useState(""); const [style, setStyle] = useState("study"); const [format, setFormat] = useState("markdown");
  const [processing, setProcessing] = useState(false); const [result, setResult] = useState<any>(null); const [error, setError] = useState(""); const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!url.trim()) return;
    setProcessing(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,style,format})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail||data.error||"Failed");
      setResult(data);
    } catch(e:any){setError(e.message);} finally{setProcessing(false);}
  }

  function handleCopy(){if(!result)return;navigator.clipboard.writeText(result.notes);setCopied(true);setTimeout(()=>setCopied(false),2000);}
  function handleDownload(){if(!result)return;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([result.notes],{type:"text/markdown"}));a.download=`notes-${Date.now()}.md`;a.click();}

  return (
    <AppLayout>
      <div style={{maxWidth:"800px",margin:"0 auto",padding:"40px 24px 80px"}}>
        <div className="flex items-center gap-3 mb-8">
          <div style={{width:"42px",height:"42px",borderRadius:"10px",background:"rgba(255,45,45,0.15)",border:"1px solid rgba(255,45,45,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}><BookOpen size={20} style={{color:"#FF2D2D"}}/></div>
          <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"26px",color:"#fff"}}>YouTube to Notes</h1><p style={{color:"#606060",fontSize:"14px"}}>Convert any YouTube video into structured AI-generated notes.</p></div>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="mb-5"><input type="text" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGenerate()} placeholder="Paste YouTube URL..." className="input-field w-full" style={{height:"50px",fontSize:"15px"}}/></div>
          <div className="mb-5">
            <label style={{fontSize:"12px",color:"#606060",display:"block",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Notes Style</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"12px"}}>
              {Object.entries(STYLES).map(([key,val])=>(
                <button key={key} onClick={()=>setStyle(key)} className="p-3 rounded-xl text-left" style={{border:`1px solid ${style===key?"rgba(255,45,45,0.4)":"rgba(255,255,255,0.06)"}`,background:style===key?"rgba(255,45,45,0.08)":"rgba(255,255,255,0.02)",cursor:"pointer"}}>
                  <div style={{fontSize:"20px",marginBottom:"4px"}}>{val.icon}</div>
                  <div style={{fontSize:"13px",fontWeight:600,color:style===key?"#FF2D2D":"#fff",marginBottom:"2px"}}>{val.label}</div>
                  <div style={{fontSize:"11px",color:"#606060"}}>{val.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <label style={{fontSize:"12px",color:"#606060",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Format</label>
            <div className="flex gap-2">{["markdown","plain"].map(f=><button key={f} onClick={()=>setFormat(f)} className="pill" style={{textTransform:"capitalize",background:format===f?"rgba(255,45,45,0.15)":undefined,borderColor:format===f?"rgba(255,45,45,0.5)":undefined,color:format===f?"#FF2D2D":undefined}}>{f==="markdown"?"Markdown":"Plain Text"}</button>)}</div>
          </div>
          {error&&<div className="mb-4 flex items-center gap-2 p-3 rounded-lg" style={{background:"rgba(255,45,45,0.08)",border:"1px solid rgba(255,45,45,0.2)",fontSize:"13px",color:"#FF6B6B"}}><AlertCircle size={14}/>{error}</div>}
          <button onClick={handleGenerate} disabled={!url||processing} className="btn-red w-full flex items-center justify-center gap-2" style={{padding:"14px",fontSize:"15px",fontWeight:700,opacity:!url?0.5:1}}>
            {processing?<><Loader2 size={16} className="animate-spin"/>Generating...</>:<><BookOpen size={16}/>Generate Notes</>}
          </button>
        </div>

        {processing&&<div className="glass-card p-8 text-center mb-6"><Loader2 size={32} className="animate-spin mx-auto mb-4" style={{color:"#FF2D2D"}}/><p style={{color:"#A0A0A0",fontSize:"14px"}}>Fetching transcript and generating notes...</p><p style={{color:"#606060",fontSize:"12px",marginTop:"8px"}}>20–40 seconds</p></div>}

        {result&&(
          <div className="glass-card overflow-hidden mb-6">
            <div className="flex items-center justify-between p-4" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div><h3 style={{fontSize:"14px",fontWeight:600,color:"#fff"}}>{result.title}</h3><p style={{fontSize:"12px",color:"#606060"}}>{result.channel} · {result.duration}</p></div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-ghost flex items-center gap-2" style={{padding:"7px 14px",fontSize:"12px"}}>{copied?<><Check size={12}/>Copied!</>:<><Copy size={12}/>Copy</>}</button>
                <button onClick={handleDownload} className="btn-ghost flex items-center gap-2" style={{padding:"7px 14px",fontSize:"12px"}}><Download size={12}/>Download .md</button>
              </div>
            </div>
            <div style={{padding:"20px",maxHeight:"600px",overflowY:"auto"}}>
              <pre style={{fontSize:"13px",color:"#C0C0C0",lineHeight:1.8,fontFamily:format==="markdown"?"monospace":"inherit",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{result.notes}</pre>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
