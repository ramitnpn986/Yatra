import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const cookie = req.headers.get("cookie") || "";

        const res = await fetch(`${process.env.TRANSPORTER_URL}/change-location`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },
            body: JSON.stringify(body)
        })

        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 }
        );
    }
}