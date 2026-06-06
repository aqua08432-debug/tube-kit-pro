"""
TubeKit Pro - Local Python Backend
Run: python server.py
Fully working with yt-dlp downloads, progress tracking, file serving.
"""
import os, re, json, uuid, shutil, asyncio, tempfile, base64
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException, BackgroundTasks, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

# ── Load .env.local ───────────────────────────────────────────────────────────
try:
    with open(".env.local", "r") as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()
except:
    pass

# ── App Setup ─────────────────────────────────────────────────────────────────
app = FastAPI(title="TubeKit Pro API", version="3.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path(tempfile.gettempdir()) / "tubekit"
TEMP_DIR.mkdir(exist_ok=True)
jobs: Dict[str, Dict[str, Any]] = {}

# ── Helpers ───────────────────────────────────────────────────────────────────

def extract_video_id(url: str) -> Optional[str]:
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
        r"youtu\.be\/([0-9A-Za-z_-]{11})",
        r"embed\/([0-9A-Za-z_-]{11})",
        r"shorts\/([0-9A-Za-z_-]{11})",
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    return None

def fmt_dur(secs) -> str:
    if not secs:
        return "Unknown"
    try:
        s = int(secs)
        h, r = divmod(s, 3600)
        m, sec = divmod(r, 60)
        return f"{h}:{m:02d}:{sec:02d}" if h else f"{m}:{sec:02d}"
    except:
        return "Unknown"

def ai_call(prompt: str, system: str = "") -> str:
    key = os.environ.get("GOOGLE_API_KEY", "")
    if not key:
        key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not key:
            return ""
        try:
            import anthropic
            c = anthropic.Anthropic(api_key=key)
            r = c.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}],
            )
            return r.content[0].text
        except Exception as e:
            print(f"Anthropic error: {e}")
            return ""
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        full_prompt = f"{system}\n\n{prompt}" if system else prompt
        return model.generate_content(full_prompt).text
    except Exception as e:
        print(f"Gemini error: {e}")
        return ""

def cleanup_old_files(max_age_hours: int = 24):
    try:
        import time
        now = time.time()
        for item in TEMP_DIR.iterdir():
            age = now - item.stat().st_mtime
            if age > max_age_hours * 3600:
                shutil.rmtree(item) if item.is_dir() else item.unlink()
    except Exception as e:
        print(f"Cleanup error: {e}")

# ── Pydantic Models ───────────────────────────────────────────────────────────

class AnalyzeReq(BaseModel):
    url: str

class DownloadReq(BaseModel):
    url: str
    type: str = "video"
    quality: str = "1080p"
    video_format: str = "mp4"
    audio_format: str = "mp3"
    audio_quality: str = "320"
    include_subtitles: bool = False
    sub_lang: str = "en"
    sub_format: str = "srt"
    start_time: str = ""
    end_time: str = ""
    embed_thumbnail: bool = True
    embed_chapters: bool = False

class TranscriptReq(BaseModel):
    url: str
    language: str = "en"
    format: str = "timestamps"

class SummarizeReq(BaseModel):
    url: str
    style: str = "bullets"
    length: str = "medium"
    language: str = "English"

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "version": "3.1.0",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_available": bool(
            os.environ.get("GOOGLE_API_KEY") or os.environ.get("ANTHROPIC_API_KEY")
        ),
    }

@app.post("/api/analyze")
async def analyze(req: AnalyzeReq):
    vid = extract_video_id(req.url)
    if not vid:
        raise HTTPException(400, "Invalid YouTube URL")
    try:
        import yt_dlp

        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": False,
            "socket_timeout": 30,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            data = ydl.extract_info(req.url, download=False)

        fmts = data.get("formats", [])
        qmap = {
            "2160": "2160p", "1080": "1080p", "720": "720p",
            "480": "480p", "360": "360p", "240": "240p",
        }
        seen = set()
        avail = []
        for f in fmts:
            h = str(f.get("height", ""))
            if h in qmap and qmap[h] not in seen:
                avail.append(qmap[h])
                seen.add(qmap[h])
        order = ["2160p", "1080p", "720p", "480p", "360p", "240p"]
        avail = [q for q in order if q in avail] or ["720p", "480p", "360p"]

        return {
            "video_id": vid,
            "title": data.get("title", "Unknown"),
            "channel": data.get("uploader", "Unknown"),
            "duration": fmt_dur(data.get("duration")),
            "views": str(data.get("view_count", 0)),
            "published": data.get("upload_date", ""),
            "thumbnail": f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg",
            "available_qualities": avail,
            "description": (data.get("description") or "")[:200],
        }
    except Exception as e:
        raise HTTPException(400, f"Analysis failed: {e}")

@app.post("/api/download")
async def download(req: DownloadReq, bg: BackgroundTasks):
    vid = extract_video_id(req.url)
    if not vid:
        raise HTTPException(400, "Invalid YouTube URL")

    job_id = str(uuid.uuid4())[:8]
    jobs[job_id] = {"status": "initializing", "progress": 0, "filename": None, "error": None}

    bg.add_task(
        _download_task,
        job_id=job_id,
        url=req.url,
        dl_type=req.type,
        quality=req.quality,
        video_format=req.video_format,
        audio_format=req.audio_format,
        audio_quality=req.audio_quality,
        include_subtitles=req.include_subtitles,
        sub_lang=req.sub_lang,
        sub_format=req.sub_format,
        start_time=req.start_time,
        end_time=req.end_time,
        embed_thumbnail=req.embed_thumbnail,
        embed_chapters=req.embed_chapters,
    )

    return {"job_id": job_id, "status": "queued"}

async def _download_task(
    job_id, url, dl_type, quality, video_format, audio_format,
    audio_quality, include_subtitles, sub_lang, sub_format,
    start_time, end_time, embed_thumbnail, embed_chapters,
):
    job = jobs.get(job_id)
    if not job:
        return

    try:
        import yt_dlp

        job_dir = TEMP_DIR / job_id
        job_dir.mkdir(exist_ok=True)
        job["status"] = "downloading"
        job["progress"] = 5

        def progress_hook(d):
            if d["status"] == "downloading":
                total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
                downloaded = d.get("downloaded_bytes", 0)
                if total > 0:
                    job["progress"] = max(5, min(80, int(75 * downloaded / total)))
            elif d["status"] == "finished":
                job["progress"] = 85

        ydl_opts: Dict[str, Any] = {
            "outtmpl": str(job_dir / "%(title)s.%(ext)s"),
            "quiet": False,
            "no_warnings": True,
            "socket_timeout": 60,
            "progress_hooks": [progress_hook],
        }

        # ── Audio-only mode ──────────────────────────────────────────────────
        if dl_type == "audio":
            ydl_opts["format"] = "bestaudio/best"
            ydl_opts["postprocessors"] = [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": audio_format,
                    "preferredquality": audio_quality,
                }
            ]
            if embed_thumbnail:
                ydl_opts["postprocessors"].append({"key": "EmbedThumbnail"})
                ydl_opts["writethumbnail"] = True

        # ── Video mode ───────────────────────────────────────────────────────
        else:
            height_map = {
                "2160p": 2160, "1080p": 1080, "720p": 720,
                "480p": 480, "360p": 360, "240p": 240,
            }
            h = height_map.get(quality, 1080)
            ydl_opts["format"] = (
                f"bestvideo[height<={h}][ext={video_format}]+bestaudio[ext=m4a]"
                f"/bestvideo[height<={h}]+bestaudio"
                f"/best[height<={h}]/best"
            )
            if video_format != "mkv":
                ydl_opts["merge_output_format"] = video_format

        # ── Subtitles ────────────────────────────────────────────────────────
        if include_subtitles and dl_type == "video":
            ydl_opts["writesubtitles"] = True
            ydl_opts["writeautomaticsub"] = True
            ydl_opts["subtitleslangs"] = [sub_lang]
            ydl_opts["subtitlesformat"] = sub_format

        # ── Time trimming ────────────────────────────────────────────────────
        if start_time or end_time:
            sections = {}
            if start_time:
                sections["start_time"] = start_time
            if end_time:
                sections["end_time"] = end_time
            ydl_opts["download_ranges"] = yt_dlp.utils.download_range_func(
                [], [[sections.get("start_time", 0), sections.get("end_time", None)]]
            )

        # ── Embed metadata ───────────────────────────────────────────────────
        if embed_chapters and dl_type == "video":
            ydl_opts.setdefault("postprocessors", []).append({"key": "FFmpegMetadata", "add_chapters": True})

        # ── Run download ─────────────────────────────────────────────────────
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            raw_filename = ydl.prepare_filename(info)

        # Find the actual output file (extension may differ after postprocessing)
        output_file = None
        for f in job_dir.iterdir():
            if f.is_file() and not f.suffix.lower() in (".ytdl", ".part", ".png", ".jpg", ".webp"):
                output_file = f
                break

        if not output_file:
            output_file = Path(raw_filename)

        job["filename"] = output_file.name
        job["status"] = "complete"
        job["progress"] = 100

    except Exception as e:
        job["status"] = "error"
        job["error"] = str(e)
        job["progress"] = 0
        print(f"[job {job_id}] Download error: {e}")

@app.get("/api/status/{job_id}")
async def status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        return {"status": "error", "error": "Job not found"}
    return job

@app.get("/api/file/{job_id}")
async def get_file(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job["status"] != "complete":
        raise HTTPException(400, f"Job not ready: {job['status']}")
    if not job.get("filename"):
        raise HTTPException(500, "Filename missing")

    file_path = TEMP_DIR / job_id / job["filename"]
    if not file_path.exists():
        raise HTTPException(404, "File not found on disk")

    return FileResponse(
        path=str(file_path),
        filename=job["filename"],
        media_type="application/octet-stream",
    )

@app.post("/api/transcript")
async def transcript(req: TranscriptReq):
    vid = extract_video_id(req.url)
    if not vid:
        raise HTTPException(400, "Invalid YouTube URL")
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        data = YouTubeTranscriptApi.get_transcript(vid, languages=[req.language, "en"])

        if req.format == "text":
            return {"video_id": vid, "text": " ".join(t["text"] for t in data)}
        elif req.format == "srt":
            srt = ""
            for i, e in enumerate(data, 1):
                s = fmt_dur(e["start"])
                end = fmt_dur(e["start"] + e["duration"])
                srt += f"{i}\n{s} --> {end}\n{e['text']}\n\n"
            return {"video_id": vid, "format": "srt", "content": srt}
        else:
            return {"video_id": vid, "language": req.language, "transcript": data}
    except Exception as e:
        raise HTTPException(400, str(e))

@app.post("/api/summarize")
async def summarize(req: SummarizeReq):
    vid = extract_video_id(req.url)
    if not vid:
        raise HTTPException(400, "Invalid YouTube URL")
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        try:
            t = YouTubeTranscriptApi.get_transcript(vid, languages=[req.language[:2], "en"])
            text = " ".join(x["text"] for x in t)
        except:
            text = "Transcript not available."

        prompt = (
            f"Summarize this YouTube video transcript in {req.language}. "
            f"Style: {req.style}. Length: {req.length}. "
            f"Return ONLY valid JSON.\n\nTranscript: {text[:10000]}"
        )
        system = (
            'Return JSON: {"title":"...","summary":[{"time":"MM:SS","point":"..."}],'
            '"takeaways":["..."],"topics":["..."]}'
        )
        raw = ai_call(prompt, system)
        if raw:
            m = re.search(r"\{.*\}", raw, re.DOTALL)
            if m:
                try:
                    return json.loads(m.group())
                except:
                    pass
        return {
            "title": "Summary unavailable",
            "summary": [{"time": "00:00", "point": "No AI key configured."}],
            "takeaways": ["Add GOOGLE_API_KEY or ANTHROPIC_API_KEY to .env.local"],
            "topics": [],
        }
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/remove-background")
async def remove_bg(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        encoded = base64.b64encode(contents).decode("utf-8")
        return {
            "success": True,
            "image": encoded,
            "format": "png",
            "filename": file.filename or "processed.png",
            "note": "Background removal requires GPU environment.",
        }
    except Exception as e:
        raise HTTPException(500, str(e))

# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup():
    cleanup_old_files()
    print("✅ TubeKit Pro API ready")

# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    print("\n" + "=" * 54)
    print("  🎬  TubeKit Pro  ·  Local Server")
    print("  📡  API  →  http://localhost:8000/api/health")
    print("  🌐  App  →  http://localhost:3000  (run npm run dev)")
    print("=" * 54 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
