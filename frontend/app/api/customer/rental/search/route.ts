import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const url = `${process.env.RIDE_REQUEST_URL}/rental/search`;

        console.log("Backend URL:", url);
        console.log("Request body:", body);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.get("cookie") || "",
            },
            body: JSON.stringify(body),
        });

        const contentType = res.headers.get("content-type");

        console.log("Backend status:", res.status);
        console.log("Backend content-type:", contentType);

        const responseText = await res.text();

        console.log("Backend response:", responseText);

        if (contentType?.includes("application/json")) {
            const data = JSON.parse(responseText);

            return NextResponse.json(data, {
                status: res.status,
            });
        }

        return NextResponse.json(
            {
                success: false,
                message: "Backend returned a non-JSON response",
                backendStatus: res.status,
                response: responseText.substring(0, 500),
            },
            {
                status: res.status >= 400 ? res.status : 500,
            }
        );

    } catch (err) {
        console.error("Rental search proxy error:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            {
                status: 500,
            }
        );
    }
}