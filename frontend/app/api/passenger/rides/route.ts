import { NextRequest, NextResponse } from "next/server";

const RideUrl = () => process.env.RIDE_URL?.trim();

export async function GET(req: NextRequest) {
    try {
        const baseUrl = RideUrl();

        if (!baseUrl) {
            console.error("RIDE_URL is not configured");

            return NextResponse.json(
                {
                    success: false,
                    message: "Rides backend URL is not configured",
                },
                { status: 500 }
            );
        }

        const res = await fetch(`${baseUrl}/get-all-rides`,
            {
                method: "GET",
                headers: {
                    Cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store",
            }
        );

        const data = await res.json();

        const response = NextResponse.json(data, {
            status: res.status,
        });

        if ([401, 403, 404].includes(res.status)) {
            response.cookies.delete("token");
        }

        return response;

    } catch (err) {
        console.error("Rides fetch failed:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 }
        );
    }
}