import { NextRequest, NextResponse } from "next/server";

const customerUrl = () => process.env.CUSTOMER_URL?.trim();

export async function GET(req: NextRequest) {
    try {
        const baseUrl = customerUrl();

        if (!baseUrl) {
            console.error("CUSTOMER_URL is not configured");
            return NextResponse.json(
                {
                    success: false,
                    message: "Customer backend URL is not configured",
                },
                { status: 500 }
            );
        } 

        const res = await fetch(`${baseUrl}/get-profile`, {
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
        console.error("Passenger profile fetch failed:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to backend",
            },
            { status: 500 }
        );
    }
}

