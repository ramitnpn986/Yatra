import { NextRequest, NextResponse } from "next/server";
const TRANSPORTER_URL= process.env.TRANSPORTER_URL;

export async function GET(req:NextRequest){
    const cookie=req.headers.get("cookie")|| "";

    const res=await fetch(`${TRANSPORTER_URL}/profile`,{
        method:"GET",
        headers:{cookie},
        credentials:"include",
    });
    const data=await res.json();
    return NextResponse.json(data,{status:res.status});
}

 export async function POST(req: NextRequest) {
     const cookie=req.headers.get("cookie")|| "";
     const formData=await req.formData();

     const res=await fetch(`{TRANSPORTER_URL}/profile`,{
        method:"POST",
        headers:{cookie},
        credentials:"include",
        body:formData,
     });

     const data=await res.json();
     return NextResponse.json(data,{status:res.status});
 }

 export async function PATCH(req:NextRequest){
    const cookie=req.headers.get("cookie")|| "";
    const body=await req.json();

    const res=await fetch(`${TRANSPORTER_URL}/availability`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json",cookie},
        credentials:"include",
        body:JSON.stringify(body),
        });

    const data= await res.json();
    return NextResponse.json(data,{status:res.status});
 }