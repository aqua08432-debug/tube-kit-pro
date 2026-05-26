import { NextRequest, NextResponse } from "next/server";

export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function proxyToBackend(req: NextRequest, endpoint: string) {
    try {
        const method = req.method;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        let body: any = null;
        if (method !== "GET" && method !== "HEAD") {
            body = await req.json();
        }

        const targetUrl = `${BACKEND_URL}${endpoint}`;
        console.log(`Proxying ${method} to ${targetUrl}`);

        const res = await fetch(targetUrl, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error(`Proxy error for ${endpoint}:`, error);
        return NextResponse.json(
            { error: "Backend offline. Please run 'python server.py' in the terminal to enable features." },
            { status: 503 }
        );
    }
}
