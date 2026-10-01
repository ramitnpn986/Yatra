import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rideId: string }> },
) {
  try {
    const { rideId } = await params;

    const response = await fetch(
      `${process.env.ADMIN_URL}/ride/${rideId}`,
      {
        method: "GET",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to backend",
      },
      { status: 500 },
    );
  }
}