import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getDataFromToken } from "@/helpers/getDataFromToken";

import { dbConnect } from "@/dbConfig/dbConnect";

dbConnect()

export async function GET(request : NextRequest){
    try {
        const token = request.cookies.get('token')?.value
        if(!token) {
            return NextResponse.json({error: "Inavlid Token"}, {status: 400})
        }

        const userId = await getDataFromToken(token)
        if (!userId) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        
        const user = await User.findById(userId)

        const updatedUser = await User.aggregate([
            {
                $match : {
                    _id: new mongoose.Types.ObjectId(userId!)
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "following",
                    as: "followersList"
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follower",
                    as: "isfollowingList"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followersList.follower", 
                    foreignField: "_id",
                    as: "followers",
                    pipeline: [
                        {
                            $project: {
                                password : 0,
                                verifyToken : 0,
                                verifyTokenExpiry : 0
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "isfollowingList.following", // array of ObjectIds
                    foreignField: "_id",
                    as: "isFollowing",
                    pipeline: [
                        {
                            $project: {
                                password : 0,
                                verifyToken : 0,
                                verifyTokenExpiry : 0
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    followers: { $size: "$followers" },
                    following: { $size: "$isFollowing" }
                }
            }
        ])

        return NextResponse.json({
            message: "User Profile fetched",
            success: true,
            data: updatedUser[0]
        }, {status: 200})

    } catch (error: any) {
        return NextResponse.json(
        {
            error: "Failed to fetch user profile",
            success: false,
        },
        { status: 500 }
        );
    }
} 