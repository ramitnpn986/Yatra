import { NextRequest, NextResponse } from "next/server";

const transporterUrl = () => process.env.TRANSPORTER_URL?.trim();

const backendResponse = async (res: Response) => {
    const text = await res.text();
    try {
        return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
        return NextResponse.json(
            { success: false, message: `Backend returned ${res.status}: ${text || "empty response"}` },
            { status: res.status }
        );
    }
};

export async function GET(req: NextRequest) {
    try {
      
        const res = await fetch(`${transporterUrl()}/get-profile`, {
            method: "GET",
            headers: { Cookie: req.headers.get("cookie") || ""},
        })

        const data = await res.json();

        const response = NextResponse.json(data, { status: res.status });

        if ([401, 403, 404].includes(res.status)) {
            response.cookies.delete("token");
        }

        return response;

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

export async function POST(req: NextRequest) {
    try {
        const body = await req.formData();
        const res = await fetch(`${transporterUrl()}/update-profile`, {
            method: "POST",
            headers: { Cookie: req.headers.get("cookie") || "" },
            body,
        });

        return backendResponse(res);
    } catch (error) {
        console.error("Transporter profile update failed:", error);
        return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const res = await fetch(`${transporterUrl()}/update-availability`, {
            method: "PATCH",
            headers: {
                Cookie: req.headers.get("cookie") || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(await req.json()),
        });

        return backendResponse(res);
    } catch (error) {
        console.error("Transporter availability update failed:", error);
        return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
    }
}