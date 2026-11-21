import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

import { dbConnect } from "@/dbConfig/dbConnect";


export async function POST(request : NextRequest) {
    await dbConnect()
    
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

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {
            expiresIn: "7d"
        })
        
        user.isLoggedIn = true

        await user.save({validateBeforeSave: false})
        const response = NextResponse.json({
            message: "User LOGGEDIN successfully",
            success: true,
            status: 200,
            data: user
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        })
        
        return response
        
    } catch (error: any) {
        return NextResponse.json({ error: error instanceof Error ? error.message : error
 || "Server error" }, { status: 500 })
    }
}
