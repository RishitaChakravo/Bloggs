import Follow from "@/models/followModel"
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest) {
    await dbConnect()
    
    try {
        const reqBody = await request.json()
        const { followingId } = reqBody
        const token = request.cookies.get('token')?.value

        if (!token) {
            return NextResponse.json({ error: "Inavlid Token" }, { status: 400 })
        }
        const userId = await getDataFromToken(token)

        if (userId === followingId) {
            return NextResponse.json({
                error: "You cannot follow yourself",
            }, { status: 400 });
        }
        const existing = await Follow.findOne({
            follower: userId,
            following: followingId
        })

        if (existing) {
            await Follow.findByIdAndDelete(existing._id)
            return NextResponse.json({
                message: "Unfollowed successfully",
                success: true
            }, { status: 200 })
        } else {
            const newFollow = await Follow.create({
                follower: userId,
                following: followingId
            })
            return NextResponse.json({
                message: "Followed successfully",
                success: true,
                data: newFollow
            }, { status: 200 })
        }
    } catch (error: any) {
        console.error("something went wrong while sending follow request", error)
        return NextResponse.json({
            error: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}
