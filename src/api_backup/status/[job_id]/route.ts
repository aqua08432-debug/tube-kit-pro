export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
const B = process.env.BACKEND_URL || "http://localhost:8000";
export async function GET(req: NextRequest, { params }: { params: { job_id: string } }) {
  try {
    const r = await fetch(`${B}/api/status/${params.job_id}`);
    const d = await r.json();
    return NextResponse.json(d, { status: r.status });
  } catch { return NextResponse.json({ error:"Backend offline" }, { status:503 }); }
}
