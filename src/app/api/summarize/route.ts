import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api-helper";

export async function POST(req: NextRequest) {
    return proxyToBackend(req, "/api/summarize");
}
