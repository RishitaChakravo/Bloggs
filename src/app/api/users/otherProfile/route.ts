import { dbConnect } from "@/dbConfig/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest){
    try {
        const {searchParams} = new URL(request.url)
        const username = searchParams.get("username")
        if(!username) {
          return NextResponse.json({ error: "Username is required" }, {status: 400})
        }

        const user = await User.findOne({username}).select("-password -verifyToken -verifyTokenExpiry")

        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true, 
            data: user
        })
    } catch (error: any) {
        console.error("❌ API Error:", error);
        return NextResponse.json({error: error},{status: 500})
    }
}