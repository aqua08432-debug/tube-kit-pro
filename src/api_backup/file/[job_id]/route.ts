import { NextRequest, NextResponse } from "next/server";
const B = process.env.BACKEND_URL || "http://localhost:8000";
export async function GET(req: NextRequest, { params }: { params: { job_id: string } }) {
  try {
    const r = await fetch(`${B}/api/file/${params.job_id}`);
    if (!r.ok) { const d = await r.json(); return NextResponse.json(d, { status: r.status }); }
    const blob = await r.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": r.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": r.headers.get("content-disposition") || "attachment",
      }
    });
  } catch { return NextResponse.json({ error:"Backend offline" }, { status:503 }); }
}
