import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const res = await fetch(`${process.env.ADMIN_URL}/logout`, {
            method: "POST",
            headers: {
                Cookie: req.headers.get("cookie") || "",
            },
        });

        const data = await res.json();

        const response = NextResponse.json(data, {
            status: res.status,
        });

    
        const setCookie = res.headers.get("set-cookie");

        if (setCookie) {
            response.headers.set("set-cookie", setCookie);
        }

        return response;
    } catch (err) {
        console.error("Logout API error:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 }
        );
    }
}

