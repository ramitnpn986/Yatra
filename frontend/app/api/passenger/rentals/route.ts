import { NextRequest, NextResponse } from "next/server";

const rentalUrl = () => `${process.env.BACKEND_URL}/api/v8/ride-request/rental`;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${rentalUrl()}/my-rentals`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${rentalUrl()}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(await req.json()),
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const response = await fetch(`${rentalUrl()}/providers`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to connect to backend" }, { status: 500 });
  }
}