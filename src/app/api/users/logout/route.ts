import { dbConnect } from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function POST(request: NextRequest){
    try {
        const response = NextResponse.json({
            message: "LOGOUT SUCCESSFULLY",
            success: true
        }, {status: 200})

        response.cookies.set("token", " ", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response
    } catch (error: any) {
        console.error("Something went wrong while logging out", error)
    }
}