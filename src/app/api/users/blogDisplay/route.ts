import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import Like from "@/models/likeSchema";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url)
        const username = searchParams.get("username")
        
        let userId

        if (!username) {
            const token = request.cookies.get("token")?.value;
            if (!token) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
            userId = await getDataFromToken(token);
        
        } else {
            
            const user = await User.findOne({ username });
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
            userId = user._id;
        }

        const blogs = await Blog.aggregate([
            {
               $match: {
                author:new mongoose.Types.ObjectId(userId)
               } 
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            }, 
            {
                $unwind: "$authorDetails"
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "blogId",
                    as: "likeDocs"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: {blogId: "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ["$blogId", "$$blogId"]},
                                        {$eq: ["$likedBy", new mongoose.Types.ObjectId(userId)]}
                                    ]
                                }
                            } 
                        }
                    ],
                    as: "userLike"
                }
            },
            {
                $addFields: {
                    hasLiked: {$gt: [{$size: "$userLike"}, 0]},
                    likes: {$size: "$likeDocs"},
                    author: {
                        name: "$authorDetails.name",
                        username: "$authorDetails.username",
                        email: "$authorDetails.email",
                        profileImage: "$authorDetails.profileImage"
                    }
                }
            },
            {
                $project: {
                    authorDetails: 0,
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        return NextResponse.json({
            message: "All blogs successfully fetched",
            success: true,
            blogs
        }, {status: 200})
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({message: "error"}, {status: 500})       
    }
}