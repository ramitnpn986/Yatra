import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}:{params: Promise<{transporterId: string}>}) {
    try {
  
        const {transporterId} =  await params;

        const res = await fetch(`${process.env.ADMIN_URL}/transport-provider/${transporterId}`, {
            method: "GET",
            headers: {
               Cookie: req.headers.get("cookie") || ""
            },
            cache: "no-store"
        })

        const data = await res.json();
        return NextResponse.json(data, {
            status: res.status,
        });

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ transporterId: string }> }) {
    try {
        const { transporterId } = await params;
        const action = req.nextUrl.searchParams.get("action");

        if (action !== "verify-kyc" && action !== "reject-kyc") {
            return NextResponse.json({ success: false, message: "Invalid KYC action" }, { status: 400 });
        }

        const res = await fetch(
            `${process.env.ADMIN_URL}/transport-provider/${transporterId}/${action}`,
            {
                method: "PATCH",
                headers: { Cookie: req.headers.get("cookie") || "" },
                body: action === "reject-kyc" ? await req.text() : undefined,
            },
        );

        return NextResponse.json(await res.json(), { status: res.status });
    } catch {
        return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
    }
}