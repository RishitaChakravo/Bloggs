import { NextRequest, NextResponse } from "next/server";
import Like from '@/models/likeSchema'
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import mongoose from "mongoose";
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const { blogId } = await request.json()
        if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({ message: "BlogId not presentt" }, { status: 400 })
        }

        const token = request.cookies.get('token')?.value
        if (!token) {
            return NextResponse.json({ message: "Token not present" }, { status: 400 })
        }
        const userId = await getDataFromToken(token)

        const existing = await Like.findOne({
            likedBy: userId,
            blogId
        })
        if (existing) {
            return NextResponse.json({ message: "Already liked" }, { status: 200 });
        }
        if (!existing) {
            const newLike = await Like.create({
                likedBy: userId,
                blogId
            })
        }

        return NextResponse.json({
            message: "Liked",
            success: true
        }, { status: 200 })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unexpected error occurred");
        }
    }
}
