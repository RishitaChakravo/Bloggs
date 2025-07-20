import { dbConnect } from "@/dbConfig/dbConnect";
import User from "@/models/userModel";
import mongoose from "mongoose";
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

        const userId = user._id

        const updatedUser = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'following',
                    as: 'followersList'
                }
            },
            {
                $lookup: {
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'follower',
                    as: 'isFollowingList'
                }
            },
            {
                $addFields: {
                    followers: {$size: '$followersList'},
                    following: {$size: '$isFollowingList'}
                }
            },
            {
                $project: {
                    followersList: 0,
                    isFollowingList: 0
                }
            }
        ])

        return NextResponse.json({
            success: true, 
            data: updatedUser[0]
        })
    } catch (error: any) {
        console.error("❌ API Error:", error);
        return NextResponse.json({error: error},{status: 500})
    }
}