import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const res = await fetch(`${process.env.TRANSPORTER_URL}/logout`, {
            method: "POST",
            headers: {
                Cookie: req.headers.get("cookie") || "",
            },
        });

        const data = await res.json();
        const response = NextResponse.json(data, { status: res.status });

        response.cookies.delete("token");

        return response;

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
} 