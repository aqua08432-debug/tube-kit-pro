import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api-helper";

export async function GET(
    req: NextRequest,
    { params }: { params: { jobId: string } }
) {
    // Redirect to backend for file serving
    return NextResponse.redirect(`${BACKEND_URL}/api/file/${params.jobId}`);
}
