import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "@/dbConfig/dbConnect";

dbConnect()

export async function POST(request : NextRequest) {
    try {
        const reqBody: any = await request.json()
        const {email, password} = reqBody

        if(
            [email, password].some((field) => field?.trim() === "")
        ) {
            return NextResponse.json({})
        }

        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json({error: "User does not exist"})
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            return NextResponse.json({error: "Incorrect password"})
        }
        user.isLoggedIn = true

        await user.save({validateBeforeSave: false})
        return NextResponse.json({
            message: "User LOGGEDIN successfully",
            success: true,
            status: 200,
            data: user
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
    }
}