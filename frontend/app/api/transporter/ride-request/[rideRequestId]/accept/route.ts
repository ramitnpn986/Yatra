import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ rideRequestId: string }> }) {
    try {
        const { rideRequestId } = await params;
        const res = await fetch(`${process.env.RIDE_REQUEST_URL}/ride-request/accept/${rideRequestId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: req.headers.get("cookie") || "",
                },
            })

        const data = await res.json();

        const response = NextResponse.json(data,
            {
                status: res.status,
            });

        const setCookie = res.headers.get("set-cookie");
        if (setCookie) {
            response.headers.set("set-cookie", setCookie);
        }

        return response;

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: "Unable to connect to backend",
        }, { status: 500 });
    }
}