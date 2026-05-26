import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api-helper";

export async function GET(
    req: NextRequest,
    { params }: { params: { jobId: string } }
) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/status/${params.jobId}`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
    }
}
