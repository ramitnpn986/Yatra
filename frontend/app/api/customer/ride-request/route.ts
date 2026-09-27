import { NextRequest, NextResponse } from "next/server";

// Add CUSTOMER_URL to frontend/.env, matching your existing TRANSPORTER_URL
// pattern. Since backend/index.ts mounts customer routes at "/api/v8/users",
// this should be: CUSTOMER_URL=http://localhost:8000/api/v8/users
// (adjust host/port to match whatever TRANSPORTER_URL currently points to)
const customerUrl = () => process.env.CUSTOMER_URL?.trim();

const backendResponse = async (res: Response) => {
    const text = await res.text();
    try {
        return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
        return NextResponse.json(
            { success: false, message: `Backend returned ${res.status}: ${text || "empty response"}` },
            { status: res.status }
        );
    }
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const res = await fetch(`${customerUrl()}/request-ride`, {
            method: "POST",
            headers: {
                Cookie: req.headers.get("cookie") || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return backendResponse(res);
    } catch (error) {
        console.error("Ride request failed:", error);
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}