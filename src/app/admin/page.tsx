"use client";
import { useState, useEffect } from "react";
import { Activity, Download, Users, Clock, CheckCircle, XCircle, RefreshCw, Image, FileImage, Zap, Server, Key } from "lucide-react";

const ADMIN_PASS = "tubekit2024";

type Job = { job_id: string; status: string; progress: number; filename?: string; error?: string };

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [stats, setStats] = useState({ totalJobs: 0, completed: 0, failed: 0, active: 0 });
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuth(true); setPassErr(false); } else { setPassErr(true); }
  }

  async function fetchHealth() {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) { const d = await res.json(); setHealth(d); }
    } catch { setHealth(null); } finally { setLoading(false); setLastRefresh(new Date()); }
  }

  useEffect(() => { if (auth) { fetchHealth(); const t = setInterval(fetchHealth, 15000); return () => clearInterval(t); } }, [auth]);

  if (!auth) return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div className="glass-card p-8" style={{width:"100%",maxWidth:"380px"}}>
        <div className="flex items-center gap-3 mb-6">
          <div style={{width:"40px",height:"40px",borderRadius:"10px",background:"linear-gradient(135deg,#FF2D2D,#FF6B35)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"14px",color:"#fff"}}>TK</div>
          <div><h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"18px",color:"#fff"}}>Admin Panel</h1><p style={{fontSize:"12px",color:"#606060"}}>TubeKit Pro</p></div>
        </div>
        <form onSubmit={handleLogin}>
          <label style={{fontSize:"12px",color:"#606060",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Password</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter admin password" className="input-field w-full" style={{marginBottom:"12px",height:"46px"}} autoFocus/>
          {passErr&&<p style={{fontSize:"13px",color:"#FF2D2D",marginBottom:"12px"}}>Incorrect password</p>}
          <button type="submit" className="btn-red w-full" style={{padding:"12px",fontSize:"14px",fontWeight:600}}>Login</button>
        </form>
        <p style={{fontSize:"11px",color:"#606060",textAlign:"center",marginTop:"16px"}}>Default password: <code style={{color:"#A0A0A0",background:"rgba(255,255,255,0.05)",padding:"1px 6px",borderRadius:"3px"}}>tubekit2024</code></p>
      </div>
    </div>
  );

  const statusColor = health ? "#10B981" : "#FF2D2D";
  const statusText = health ? "Backend Online" : "Backend Offline";

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",padding:"0"}}>
      {/* Top bar */}
      <div style={{background:"#111",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div className="flex items-center gap-3">
          <div style={{width:"36px",height:"36px",borderRadius:"8px",background:"linear-gradient(135deg,#FF2D2D,#FF6B35)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"13px",color:"#fff"}}>TK</div>
          <div><span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:"16px",color:"#fff"}}>TubeKit Pro</span><span style={{fontSize:"12px",color:"#606060",marginLeft:"8px"}}>Admin Panel</span></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><div style={{width:"8px",height:"8px",borderRadius:"50%",background:statusColor,boxShadow:`0 0 8px ${statusColor}`}}/><span style={{fontSize:"13px",color:statusColor,fontWeight:500}}>{statusText}</span></div>
          <button onClick={fetchHealth} disabled={loading} className="btn-ghost flex items-center gap-2" style={{padding:"8px 14px",fontSize:"12px"}}><RefreshCw size={13} className={loading?"animate-spin":""}/>Refresh</button>
          <button onClick={()=>{setAuth(false);setPass("");}} className="btn-ghost" style={{padding:"8px 14px",fontSize:"12px"}}>Logout</button>
        </div>
      </div>

      <div style={{padding:"32px",maxWidth:"1200px",margin:"0 auto"}}>
        {/* Status cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"16px",marginBottom:"28px"}}>
          {[
            {icon:Server,label:"Backend Status",value:health?"Running":"Offline",color:health?"#10B981":"#FF2D2D",bg:health?"rgba(16,185,129,0.1)":"rgba(255,45,45,0.1)"},
            {icon:Zap,label:"yt-dlp",value:health?.yt_dlp?"✓ Ready":"✗ Not found",color:health?.yt_dlp?"#10B981":"#FF2D2D",bg:"rgba(255,255,255,0.02)"},
            {icon:Key,label:"Anthropic AI",value:health?.anthropic?"✓ Configured":"✗ No API Key",color:health?.anthropic?"#10B981":"#f59e0b",bg:"rgba(255,255,255,0.02)"},
            {icon:Clock,label:"Last Refresh",value:lastRefresh?lastRefresh.toLocaleTimeString():"—",color:"#A0A0A0",bg:"rgba(255,255,255,0.02)"},
          ].map(c=>(
            <div key={c.label} className="glass-card p-5" style={{background:c.bg}}>
              <div className="flex items-center gap-3 mb-2"><c.icon size={18} style={{color:c.color}}/><span style={{fontSize:"12px",color:"#606060",textTransform:"uppercase",letterSpacing:"0.06em"}}>{c.label}</span></div>
              <div style={{fontSize:"15px",fontWeight:600,color:c.color}}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"28px"}}>
          {/* Backend info */}
          <div className="glass-card p-6">
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:"15px",color:"#fff",marginBottom:"16px",paddingBottom:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>Server Info</h2>
            {health ? (
              <div className="space-y-3">
                {[["Version",health.version||"2.0.0"],["Status","Running"],["Port","8000"],["yt-dlp",health.yt_dlp?"Installed":"Missing"],["Anthropic AI",health.anthropic?"Configured":"Not configured"]].map(([k,v])=>(
                  <div key={k} className="flex justify-between"><span style={{fontSize:"13px",color:"#606060"}}>{k}</span><span style={{fontSize:"13px",color:"#fff",fontWeight:500}}>{v}</span></div>
                ))}
              </div>
            ) : (
              <div style={{textAlign:"center",padding:"20px"}}>
                <XCircle size={32} style={{color:"#FF2D2D",margin:"0 auto 12px"}}/>
                <p style={{fontSize:"13px",color:"#FF6B6B",marginBottom:"8px"}}>Backend is not running</p>
                <p style={{fontSize:"12px",color:"#606060"}}>Open a terminal in the project folder and run:</p>
                <code style={{display:"block",marginTop:"8px",padding:"8px 12px",background:"rgba(255,255,255,0.05)",borderRadius:"6px",fontSize:"12px",color:"#A0A0A0"}}>python server.py</code>
              </div>
            )}
          </div>

          {/* AI Key setup */}
          <div className="glass-card p-6">
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:"15px",color:"#fff",marginBottom:"4px"}}>AI Features (Anthropic)</h2>
            <p style={{fontSize:"12px",color:"#606060",marginBottom:"16px"}}>Required for AI Summarizer, Notes, and future AI tools.</p>
            <div style={{marginBottom:"12px"}}>
              <label style={{fontSize:"11px",color:"#606060",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Anthropic API Key</label>
              <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-..." className="input-field w-full" style={{fontSize:"13px",marginBottom:"10px",fontFamily:"monospace"}}/>
              <p style={{fontSize:"11px",color:"#606060",marginBottom:"10px"}}>To activate: set the environment variable before starting server.py</p>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"8px",padding:"10px 14px",border:"1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontSize:"11px",color:"#606060",marginBottom:"4px"}}>Windows (Command Prompt):</p>
                <code style={{fontSize:"12px",color:"#A0A0A0"}}>set ANTHROPIC_API_KEY={apiKey||"your_key_here"}</code>
                <p style={{fontSize:"11px",color:"#606060",marginTop:"8px",marginBottom:"4px"}}>Then start the backend:</p>
                <code style={{fontSize:"12px",color:"#A0A0A0"}}>python server.py</code>
              </div>
            </div>
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center justify-center gap-2" style={{padding:"9px",fontSize:"12px",textDecoration:"none",display:"flex"}}>Get API Key at console.anthropic.com →</a>
          </div>
        </div>

        {/* Tools status */}
        <div className="glass-card p-6 mb-6">
          <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:"15px",color:"#fff",marginBottom:"16px",paddingBottom:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>All Tools Status</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"10px"}}>
            {[
              {name:"YouTube Downloader",icon:"📥",needs:"yt-dlp",ok:health?.yt_dlp},
              {name:"YouTube to MP3",icon:"🎵",needs:"yt-dlp",ok:health?.yt_dlp},
              {name:"YouTube to MP4",icon:"🎬",needs:"yt-dlp",ok:health?.yt_dlp},
              {name:"YouTube Transcript",icon:"📝",needs:"youtube-transcript-api",ok:!!health},
              {name:"YouTube Summarizer",icon:"✨",needs:"Anthropic API Key",ok:health?.anthropic},
              {name:"YouTube to Notes",icon:"📚",needs:"Anthropic API Key",ok:health?.anthropic},
              {name:"YouTube Subtitle",icon:"💬",needs:"youtube-transcript-api",ok:!!health},
              {name:"BG Remover",icon:"🖼️",needs:"rembg",ok:!!health},
              {name:"HEIC Converter",icon:"📱",needs:"pillow-heif",ok:!!health},
            ].map(t=>(
              <div key={t.name} className="flex items-center gap-3 p-3 rounded-lg" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <span style={{fontSize:"18px"}}>{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <p style={{fontSize:"12px",fontWeight:500,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</p>
                  <p style={{fontSize:"10px",color:"#606060"}}>{t.needs}</p>
                </div>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:t.ok?"#10B981":"#FF2D2D",flexShrink:0}}/>
              </div>
            ))}
          </div>
        </div>

        {/* Quick start */}
        <div className="glass-card p-6">
          <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:"15px",color:"#fff",marginBottom:"16px",paddingBottom:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>Quick Start Guide</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
            <div>
              <h3 style={{fontSize:"13px",fontWeight:600,color:"#A0A0A0",marginBottom:"12px"}}>Start Everything</h3>
              <div className="space-y-2">
                {[
                  "cd \"C:\\Users\\DELL\\Documents\\Antigravity\\Youtube Downloder\\tube-kit-pro\"",
                  "python server.py",
                  "# New terminal window:",
                  "npm run dev",
                  "# Open: http://localhost:3000"
                ].map((cmd,i)=>(
                  <div key={i} style={{padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <code style={{fontSize:"11px",color:cmd.startsWith("#")?"#606060":"#A0A0A0",fontFamily:"monospace"}}>{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{fontSize:"13px",fontWeight:600,color:"#A0A0A0",marginBottom:"12px"}}>With AI Features</h3>
              <div className="space-y-2">
                {[
                  "# Set API key first:",
                  "set ANTHROPIC_API_KEY=sk-ant-...",
                  "# Then start:",
                  "python server.py",
                  "npm run dev"
                ].map((cmd,i)=>(
                  <div key={i} style={{padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <code style={{fontSize:"11px",color:cmd.startsWith("#")?"#606060":"#A0A0A0",fontFamily:"monospace"}}>{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
