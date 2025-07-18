import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Comment from '@/models/commentModel'

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized: No token provided", success: false },
                { status: 401 }
            );
        }
        const userId = await getDataFromToken(token)
        if (!userId) {
            return NextResponse.json(
                { message: "Invalid token", success: false },
                { status: 401 }
            );
        }

        const reqBody = await request.json()
        const { content, blogId } = reqBody
        if (!content || typeof content !== "string" || content.trim() === "") {
            return NextResponse.json(
                { message: "Comment content is required", success: false },
                { status: 400 }
            );
        }
        if (!blogId || typeof blogId !== "string") {
            return NextResponse.json(
                { message: "Blog ID is required", success: false },
                { status: 400 }
            );
        }
        const comment = await Comment.create({
            content,
            blog: blogId,
            author: userId
        })

        return NextResponse.json({
            message: "Comment created",
            success: true,
            comment
        }, { status: 200 })
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 })
    }
}