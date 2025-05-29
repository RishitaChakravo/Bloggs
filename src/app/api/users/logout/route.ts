import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function POST(request: NextRequest){
    try {
        const token = request.cookies.get("token")?.value

        if (!token) {
            return NextResponse.json({
                message: "No token found",
                success: false,
            }, { status: 401 });
        }

        const userId = await getDataFromToken(token!)
        const user = await User.findByIdAndUpdate(userId, {
            isLoggedIn: false
        })

        const response = NextResponse.json({
            message: "LOGOUT SUCCESSFULLY",
            success: true
        }, {status: 200})

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response
    } catch (error: any) {
        console.error("Something went wrong while logging out", error)
        return NextResponse.json({
            message: "Logout failed",
            success: false,
        }, { status: 500 });
    }
}

