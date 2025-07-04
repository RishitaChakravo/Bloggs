import { dbConnect } from "@/dbConfig/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export default async function GET(request: NextRequest, {params} : {params : {username : string}}){
    try {
        const {username} = params
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
        return NextResponse.json({error: error},{status: 500})
    }
}