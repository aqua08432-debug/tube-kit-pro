import { NextRequest, NextResponse } from "next/server";
const B = process.env.BACKEND_URL || "http://localhost:8000";
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await fetch(`${B}/api/convert-heic`, { method:"POST", body:formData });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch { return NextResponse.json({ error:"Backend offline. Run: python server.py" }, { status:503 }); }
}
