import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");

    let backendPath = "/rides";
    if (status === "active") backendPath = "/rides/active";
    else if (status === "completed") backendPath = "/rides/completed";
    else if (status === "cancelled") backendPath = "/rides/cancelled";

    const response = await fetch(`${process.env.ADMIN_URL}${backendPath}`, {
      method: "GET",
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

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