import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ transporterId: string }> }) {
    try {
        const { transporterId } = await params;

        const body = await req.json();

        const response = await fetch(`${process.env.ADMIN_URL}/transport-provider/${transporterId}/block-unblock`,
            {
                method: "PATCH",
                headers: {
                    Cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store",
                body: JSON.stringify(body),
            },
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 },
        );
    }
}