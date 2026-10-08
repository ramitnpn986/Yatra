import {NextRequest, NextResponse} from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }:{ params: Promise <{ vehicleId: string}>}
){
    try{
        const {vehicleId}= await params;
        const body= await req.json();

        const res= await fetch(
            `${process.env.TRANSPORTER_URL}/vehicles/${vehicleId}/rental-availability`,
            {
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Cookie":req.headers.get("cookie") || "",
                },
                body:JSON.stringify(body),
            }
        );
        const data= await res.json();
        return NextResponse.json(data, {status:res.status});
    }catch(err){
        console.log(err);
        return NextResponse.json(
            {success:false, message:"Unable to connect to backend"},
            {status:500}
        );
    }
}