import { NextRequest, NextResponse } from "next/server";

const passengerUrl = () => process.env.PASSENGER_URL?.trim();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${passengerUrl()}/change-password`, {
            method: "POST",
            headers: {
                Cookie: req.headers.get("cookie") || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("Passenger password change failed:", err);
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}