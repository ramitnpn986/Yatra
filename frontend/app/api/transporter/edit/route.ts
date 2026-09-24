import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const res = await fetch(
            `${process.env.TRANSPORTER_URL}/update-profile`,
            {
                method: "POST",
                headers: {
                    Cookie: req.headers.get("cookie") || "",
                },
                body: formData,
            }
        );

        const text = await res.text();

        console.log("Backend status:", res.status);
        console.log("Backend response:", text);

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
                {
                    status: 502,
                }
            );
        }

        return NextResponse.json(data, {
            status: res.status,
        });
    } catch (err) {
        console.error("Transporter edit proxy error:", err);

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