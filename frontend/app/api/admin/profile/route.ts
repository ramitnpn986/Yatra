import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(`${process.env.ADMIN_URL}/get-profile`, {
            method: "GET",
            headers: {
                Cookie: req.headers.get("cookie") || "",
            },
        });

        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}