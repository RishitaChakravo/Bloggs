import Blog from "@/models/blogModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        const blogs = await Blog.aggregate([
            {
                $sort: {
                    likes: -1
                }
            },
            {
                $limit: 30
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author"},
            {
                $project: {
                    content: 1,
                    title: 1,
                    authorName: "$author.name",
                    username: "$author.username"
                }
            }
        ])

        return NextResponse.json({
            message: "Popular Blogs Fetched",
            success: true,
            blogs
        }, {status: 200})

    } catch (error: any) {
        return NextResponse.json({
            error: "Error in fetching blogs",
            success: false
        }, {status: 500})
    }
}