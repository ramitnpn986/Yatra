import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const customerUrl = process.env.CUSTOMER_URL?.trim();

        if (!customerUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message: "CUSTOMER_URL is not configured",
                },
                { status: 500 }
            );
        }

        const res = await fetch(`${customerUrl}/change-password`, {
            method: "POST",
            headers: {
                Cookie: req.headers.get("cookie") || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });
    } catch (err) {
        console.error("Passenger password change failed:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 }
        );
    }
}