import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ vehicleId: string }> }) {
    try {
        
        console.log("dfldsfljadsfjldsfkladslfadslfadslfaskldfadsklf")
        const { vehicleId } = await params;
        if (!vehicleId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle ID is required",
                },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.RIDE_REQUEST_URL}/vehicle/${vehicleId}`, {
            method: "GET",
            headers: {
                "Cookie": req.headers.get("cookie") || "",
            },
            cache: "no-store"
        });

        const contentType = res.headers.get("content-type");
        const responseText = await res.text();


        if (contentType?.includes("application/json")) {
            const data = JSON.parse(responseText);

            return NextResponse.json(data, {
                status: res.status,
            });
        }

        return NextResponse.json(
            {
                success: false,
                message: "Backend returned a non-JSON response",
                backendStatus: res.status,
                response: responseText.substring(0, 500),
            },
            {
                status: res.status >= 400 ? res.status : 500,
            }
        );

    } catch (err) {
        console.error("Vehicle details fetch error:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            {
                status: 500,
            }
        );
    }
}