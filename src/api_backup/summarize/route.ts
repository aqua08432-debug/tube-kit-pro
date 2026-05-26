import { NextRequest, NextResponse } from "next/server";
const B = process.env.BACKEND_URL || "http://localhost:8000";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${B}/api/summarize`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body), signal: AbortSignal.timeout(90000) });
    const d = await r.json();
    return NextResponse.json(d, { status: r.status });
  } catch { return NextResponse.json({ error:"Backend offline. Run: python server.py" }, { status:503 }); }
}
