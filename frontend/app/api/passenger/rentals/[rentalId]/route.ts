import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ rentalId: string }> }) {
  try {
    const { rentalId } = await params;
    const response = await fetch(`${process.env.BACKEND_URL}/api/v8/ride-request/rental/cancel/${rentalId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(await req.json().catch(() => ({}))),
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
  }
}