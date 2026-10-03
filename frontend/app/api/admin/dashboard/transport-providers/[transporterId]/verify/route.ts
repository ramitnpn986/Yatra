import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ transporterId: string }> }) {
    try {
        const { transporterId } = await params;
        const res = await fetch(`${process.env.ADMIN_URL}/transport-provider/${transporterId}/verify`, {
            method: "PATCH",
            headers: {
                Cookie: req.headers.get("cookie") || "",
            },
            cache: "no-store",
        });

        const data = await res.json();

        return NextResponse.json(data,{
             status: res.status,
        })


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