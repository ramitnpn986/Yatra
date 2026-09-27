import { NextRequest, NextResponse } from "next/server";

// Mirrors the pattern used by transporter/profile/route.ts. Backend
// customer routes are mounted at /api/v8/users (see backend/index.ts),
// same base as passenger/login, passenger/register, passenger/update
// already use — so this should point at the same env var they do.
// If passenger/update/route.ts uses a different env var name, match that
// instead of PASSENGER_URL below.
const passengerUrl = () => process.env.PASSENGER_URL?.trim();

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(`${passengerUrl()}/get-profile`, {
            method: "GET",
            headers: { Cookie: req.headers.get("cookie") || "" },
        });

        const data = await res.json();

        const response = NextResponse.json(data, { status: res.status });

        if ([401, 403, 404].includes(res.status)) {
            response.cookies.delete("token");
        }

        return response;
    } catch (err) {
        console.error("Passenger profile fetch failed:", err);
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}