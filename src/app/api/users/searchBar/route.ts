import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url);
        const prompt = searchParams.get("query");
        const token = request.cookies.get('token')?.value
        if(!token) {
            return NextResponse.json({})
        }

        const userId = await getDataFromToken(token)
        if(!userId){
            return NextResponse.json({})
        }

        if(!prompt) {
            return NextResponse.json({message:"No search material"}, {status:400})
        }

        const blogsRaw = await Blog.aggregate([
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "blogId",
                    as: "likesDocs"
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
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                }
            },
            { $unwind : "$author" },
            {
                $match: {
                    $or:[
                        {title: new RegExp(prompt, 'i')},
                        {content: new RegExp(prompt, 'i')},
                        {tags: {$in: [new RegExp(prompt, 'i')]}},
                        {"author.username" : new RegExp(prompt, 'i')},
                        {"author.name" : new RegExp(prompt, 'i')}
                    ]
                }
            },
            {
                $addFields: {
                    likes: {$size: "$likesDocs"},
                    hasLiked: {
                        $cond: {
                            if: {$gt : [{$size: "$userLike"}, 0]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1, 
                    content: 1,
                    author: {
                        username: 1,
                        name: 1,
                        profileImage: 1,
                    },
                    tags: 1,
                    likes: 1,
                    hasLiked: 1
                }
            }
        ])

        const blogs = blogsRaw.map(blog => {
            console.log("Raw blog _id:", blog._id); // ⬅️ See what type it is

            return {
                ...blog,
                _id: blog._id?.toString?.() || blog._id || "MISSING_ID" // safer cast
            };
        });

        const users = await User.aggregate([
            {
                $match: {
                    $or: [
                        {name: new RegExp(prompt, 'i')},
                        {username: new RegExp(prompt, 'i')}
                    ]
                }
            },
            {
                $lookup: {
                    from :"follows",
                    localField: "_id",
                    foreignField: "following",
                    as: "all_followers"
                }
            },
            {
                $addFields: {
                followers: { $size: "$all_followers" }
                }
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    profileImage: 1,
                    followers: 1
                }
            }
        ])

        return NextResponse.json({
            message:"Search succesful",
            success: true,
            blogs,
            users
        }, {status: 200})
    } catch (error: any) {
        return NextResponse.json({message:"Failed while searching"}, {status:500})
    }
}