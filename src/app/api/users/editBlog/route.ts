import { dbConnect } from "@/dbConfig/dbConnect";
import Blog from "@/models/blogModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const reqBody = await request.json()
        const { blogId, title, content, tags} = reqBody

        if (!blogId || !title || !content || tags.length === 0) {
            return NextResponse.json({
                message: "All fields are required",
                success: false
            }, { status: 400 })
        }

        const blog = await Blog.findById(blogId)
        if (!blog) {
            return NextResponse.json({
                message: "Blog doesn't exist",
                success: false
            }, { status: 404 })
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $set: {
                title,
                content,
                tags
            },
        }, { new: true })

        return NextResponse.json({
            message: "Updated Blog",
            success: true,
            blog: updatedBlog
        }, {status: 200})
    } catch (error: any) {
        console.error("Update Blog Error:", error.message);
        return NextResponse.json(
            {
                message: "Internal server error",
                success: false,
            },
            { status: 500 }
        );
    }
}