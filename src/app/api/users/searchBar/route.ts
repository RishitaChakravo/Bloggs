import { dbConnect } from "@/dbConfig/dbConnect";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url);
        const prompt = searchParams.get("query");

        if(!prompt) {
            return NextResponse.json({message:"No search material"}, {status:400})
        }

        const blogsRaw = await Blog.aggregate([
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
                $project: {
                    _id: 1,
                    title: 1, 
                    content: 1,
                    author: {
                        username: 1,
                        name: 1,
                        profileImage: 1,
                    },
                    tags: 1
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