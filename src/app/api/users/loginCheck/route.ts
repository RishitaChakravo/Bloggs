import { dbConnect } from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    await dbConnect()
    try {
        const token = request.cookies.get('token')?.value
        if(!token) {
            return NextResponse.json({
                message: "Not logged In",
                success: false
            }, {status: 401})
        }

        return NextResponse.json({
            message: "Logged In",
            success: true
        }, {status: 200})
    } catch (error:any) {
        console.error("Error in login check:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, { status: 500 });
    }
}