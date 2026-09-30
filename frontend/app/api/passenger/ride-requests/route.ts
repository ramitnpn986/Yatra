import { NextRequest, NextResponse } from "next/server";

const RideRequestUrl = () => {
    const baseUrl = process.env.BACKEND_URL?.trim();

    if (!baseUrl) {
        return null;
    }

    return `${baseUrl}/api/v8/ride-request`;
};

export async function GET(req: NextRequest) {
    try {
        const baseUrl = RideRequestUrl();

        if (!baseUrl) {
            console.error("BACKEND_URL is not configured");

            return NextResponse.json(
                {
                    success: false,
                    message: "Ride request backend URL is not configured",
                },
                { status: 500 }
            );
        }

        const res = await fetch(`${baseUrl}/get-all-ride-requests`, {
            method: "GET",
            headers: {
                Cookie: req.headers.get("cookie") || "",
            },
            cache: "no-store",
        });

        const data = await res.json();

        const response = NextResponse.json(data, {
            status: res.status,
        });

        if ([401, 403, 404].includes(res.status)) {
            response.cookies.delete("token");
        }

        return response;
    } catch (err) {
        console.error("Ride request fetch failed:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 }
        );
    }
}