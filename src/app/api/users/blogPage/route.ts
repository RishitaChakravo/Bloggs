import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    if(!token) {
        return NextResponse.json({})
    }
    const userId = await getDataFromToken(token)
    if(!userId){
        return NextResponse.json({})
    }
    try {
        const blogs = await Blog.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails"
                }
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
                    let: { blogId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $add: [
                                        { $eq: ["$blogId", "$$blogId"] },
                                        { $eq: ["$likedBy", new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userLike"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    let: { blogId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$blog", "$$blogId"] } } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "author",
                                foreignField: "_id",
                                as: "commentAuthor"
                            }
                        },
                        { $unwind: "$commentAuthor" },
                        {
                            $addFields: {
                                author: {
                                    username: "$commentAuthor.username",
                                    profileImage: "$commentAuthor.profileImage"
                                }
                            }
                        },
                        {
                            $project: {
                                commentAuthor: 0
                            }
                        }
                    ],
                    as: "commentDocs"
                }
            },
            { $unwind: "$authorDetails" },
            {
                $addFields: {
                    hasLiked: {$gt: [{$size: "$userLike"}, 0]},
                    likes: {$size: "$likeDocs"},
                    commentCount: { $size: "$commentDocs" },
                    author: {
                        authorId: "$author",
                        name: "$authorDetails.name",
                        username: "$authorDetails.username",
                        profileImage: "$authorDetails.profileImage"
                    }
                }
            },
            {
                $project: {
                    authorDetails: 0,
                }
            }
        ])

        return NextResponse.json({
            message: "Blogs Fetched",
            success: true,
            blogs
        }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}