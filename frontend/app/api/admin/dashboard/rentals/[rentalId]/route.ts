import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ rentalId: string }> }) {
  try {
    const { rentalId } = await params;
    const response = await fetch(`${process.env.ADMIN_URL}/vehicle-rental/${rentalId}`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
  }
}