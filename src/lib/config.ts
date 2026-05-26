// API Configuration for TubeKit Pro

export const API_BASE_URL = ""; // Empty string for relative calls to /api on the same host

// Helper to determine if we are running in a native app context
export const IS_NATIVE = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;

export function getApiUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Use relative URL for browser-side calls to handle Vercel routing
    return `/api${cleanEndpoint}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = getApiUrl(endpoint);

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    return response;
}
