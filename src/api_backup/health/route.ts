import { NextResponse } from "next/server";
const B = process.env.BACKEND_URL || "http://localhost:8000";
export async function GET() {
  try {
    const res = await fetch(`${B}/health`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch { return NextResponse.json({ status:"offline" }, { status:503 }); }
}
