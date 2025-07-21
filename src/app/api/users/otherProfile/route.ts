import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get("username")
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        const user = await User.findOne({ username }).select("-password -verifyToken -verifyTokenExpiry")

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userId = user._id

        const token = request.cookies.get('token')?.value
        if (!token) {
            return NextResponse.json({
                error: "Authentication token is missing"
            }, { status: 401 });
        }
        const viewerId = await getDataFromToken(token!)

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
                $lookup: {
                    from: "follows",
                    let: { targetId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$follower', new mongoose.Types.ObjectId(viewerId!)] },
                                        { $eq: ['$following', '$$targetId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'user_follow_record'
                }
            },
            {
                $addFields: {
                    followers: { $size: '$followersList' },
                    following: { $size: '$isFollowingList' },
                    hasFollowed: { $gt: [{ $size: '$user_follow_record' }, 0] }
                }
            },
            {
                $project: {
                    followersList: 0,
                    isFollowingList: 0,
                    password: 0,
                    verifyToken: 0,
                    verifyTokenExpiry: 0,
                    user_follow_record: 0
                }
            }
        ])

        return NextResponse.json({
            success: true,
            data: updatedUser[0]
        })
    } catch (error: any) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: error }, { status: 500 })
    }
}