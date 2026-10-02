import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v8/ride-request/rental/pending`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
  }
}