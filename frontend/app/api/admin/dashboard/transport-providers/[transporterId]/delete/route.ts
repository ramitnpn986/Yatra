import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ transporterId: string }> }) {
    try {
        const { transporterId } = await params;

        const response = await fetch(`${process.env.ADMIN_URL}/transport-provider/${transporterId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store",
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