import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const formData = await req.formData();
        const res = await fetch(`${process.env.TRANSPORTER_URL}/kyc-submit`, {
            method: "POST",
            headers:{
                 Cookie: req.headers.get("cookie") || "",
            },
            body: formData,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });

    }catch(err){
        console.error("KYC API error:", err); 
        return NextResponse.json( { success: false, message: "Unable to connect to backend", }, { status: 500 } );
    }
}