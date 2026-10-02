import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ rentalId: string }> }) {
  const { rentalId } = await params;
  const response = await fetch(`${process.env.BACKEND_URL}/api/v8/ride-request/rental/reject/${rentalId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers.get("cookie") || "",
    },
    body: JSON.stringify(await req.json().catch(() => ({}))),
  });
  return NextResponse.json(await response.json(), { status: response.status });
}