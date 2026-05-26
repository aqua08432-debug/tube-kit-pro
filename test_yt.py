import subprocess, os, shutil, uuid
from pathlib import Path

TEMP_DIR = Path("test_temp")
TEMP_DIR.mkdir(exist_ok=True)

def test_download(url, dl_type, quality="1080p", audio_format="mp3"):
    job_id = str(uuid.uuid4())[:8]
    out = TEMP_DIR / job_id
    out.mkdir(exist_ok=True)
    
    args = ["--no-playlist", "--no-warnings", "-v", "-o", str(out / "%(title)s.%(ext)s")]
    
    if dl_type == "audio":
        args += ["-x", "--audio-format", audio_format, "--audio-quality", "320K"]
    else:
        h = {"1080p":"1080", "720p":"720"}.get(quality, "1080")
        args += ["-f", f"bestvideo[height<={h}]+bestaudio/best[height<={h}]/best"]
        args += ["--merge-output-format", "mp4"]
        
    args.append(url)
    
    print(f"Running: yt-dlp {' '.join(args)}")
    r = subprocess.run(["yt-dlp"] + args, capture_output=True, text=True)
    
    print(f"Exit code: {r.returncode}")
    print(f"Stdout: {r.stdout[-500:]}")
    print(f"Stderr: {r.stderr[-500:]}")
    
    files = list(out.glob("*"))
    print(f"Files in {out}: {[f.name for f in files]}")
    
    if files:
        target_ext = audio_format if dl_type == "audio" else "mp4"
        priority = [f for f in files if f.suffix.lower() == f".{target_ext}"]
        if not priority:
            priority = files
        dl = max(priority, key=lambda f: f.stat().st_size)
        print(f"Selected file: {dl.name}")

# Test with a short video
test_download("https://www.youtube.com/watch?v=aqz-KE-bpKQ", "audio") # Getting Over It speedrun or something short
test_download("https://www.youtube.com/watch?v=aqz-KE-bpKQ", "video")
