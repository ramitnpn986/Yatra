import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();

        const res = await fetch(`${process.env.RIDE_REQUEST_URL}/calculate-price`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: req.headers.get("cookie") || "",
            },
            body: JSON.stringify(body),
            cache: "no-store"
        })

        const contentType = res.headers.get("content-type");
        const responseText = await res.text();

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
        console.error("rental request error: ", err);
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