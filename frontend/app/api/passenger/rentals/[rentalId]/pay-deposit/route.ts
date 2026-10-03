import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ rentalId: string }> }) {
  const { rentalId } = await params;
  const response = await fetch(`${process.env.BACKEND_URL}/api/v8/ride-request/rental/pay-deposit/${rentalId}`, {
    method: "POST",
    headers: { Cookie: req.headers.get("cookie") || "" },
  });
  return NextResponse.json(await response.json(), { status: response.status });
}