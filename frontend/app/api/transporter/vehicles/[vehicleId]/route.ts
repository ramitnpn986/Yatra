import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ vehicleId: string }> };

export async function PUT(req: NextRequest, { params }: Context) {
    try {
        const { vehicleId } = await params;
        const formData = await req.formData();

        const res = await fetch(`${process.env.TRANSPORTER_URL}/vehicles/${vehicleId}`, {
            method: "PUT",
            headers: { Cookie: req.headers.get("cookie") || "" },
            body: formData,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: Context) {
    try {
        const { vehicleId } = await params;

        const res = await fetch(`${process.env.TRANSPORTER_URL}/vehicles/${vehicleId}`, {
            method: "DELETE",
            headers: { Cookie: req.headers.get("cookie") || "" },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { success: false, message: "Unable to connect to backend" },
            { status: 500 }
        );
    }
}