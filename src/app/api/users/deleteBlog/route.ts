import { dbConnect } from "@/dbConfig/dbConnect";
import Blog from "@/models/blogModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await dbConnect()
    
    try {
        const reqBody = await request.json()
        const {blogId} = reqBody
        if(!blogId) {
            return NextResponse.json({
                message: "Id required",
                success: false
            }, {status: 400})
        }

        const blog = await Blog.findById(blogId)
        if(!blog) {
            return NextResponse.json({
                message: "Blog doesn't exist",
                success: false
            }, {status: 404})
        }
        await Blog.findByIdAndDelete(blogId)

        return NextResponse.json({
            message:"Blog deleted",
            success: true
        }, {status: 200})
    } catch (error) {
        console.error("Delete Blog  Error:", error instanceof Error ? error.message : error)
        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, {status: 500})
    }
}
