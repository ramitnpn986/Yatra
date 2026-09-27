import { NextRequest, NextResponse } from "next/server";

// FIXED: was sending FormData, but CustomerController.updateCustomerProfile
// only reads req.body.name via express.json() — no multipart parser is
// attached to this backend route, so the old version silently never
// updated anything. Backend only supports { name }, no image upload yet
// for passengers (unlike transporter's update-profile, which does).

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${process.env.CUSTOMER_URL}/update-profile`, {
            method: "POST",
            headers: {
                Cookie: req.headers.get("cookie") || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Backend returned a non-JSON response",
                    backendResponse: text,
                },
                { status: 502 }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("Passenger profile update proxy error:", err);

        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}