import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    await dbConnect()
    
    try {
        const token = request.cookies.get('token')?.value
        if(!token) {
            console.log("Invalid token please login to proceed")
            return NextResponse.json({error: "Invalid token please login to proceed"}, {status: 400})
        }
        const userId = await getDataFromToken(token)

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        if(user.isLoggedIn) {
            return NextResponse.json({
                message: "Logged In user",
                success: true
            }, {status: 200})
        }

        return NextResponse.json({
                message: "User isnt logged In",
                success: false
            }, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : error || "Failed to login status"})
    }
}
