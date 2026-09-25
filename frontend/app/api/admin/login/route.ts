import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(`${process.env.ADMIN_URL}`)
        const res = await fetch(`${process.env.ADMIN_URL}/enter-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        const data = await res.json();

        const response = NextResponse.json(data, {
            status: res.status,
        });

        const setCookie = res.headers.get("set-cookie")
        
        if(setCookie){
             response.headers.set("set-cookie", setCookie);
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