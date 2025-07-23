import { NextRequest, NextResponse } from "next/server";
import Like from '@/models/likeSchema'
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest){
    await dbConnect()
    try {
        const {blogId} = await request.json()
        if(!blogId) {
            return NextResponse.json({message: "BlogId not presentt"},{status: 400})
        }

        const token = request.cookies.get('token')?.value
        if(!token) {
            return NextResponse.json({message: "Token not present"}, {status: 400})
        }
        const userId = await getDataFromToken(token)

        const existing = await Like.findOne({
            likedBy: userId,
            blogId
        })

        if(existing) {
            const deleted = await Like.deleteOne({
                likedBy: userId,
                blogId
            })
        }

        return NextResponse.json({
            message: "UnLiked",
            success: true
        }, {status: 200})
    } catch (error: any) {
        return NextResponse.json({message: "Internal Server Error", error: error.message}, {status: 500})
    }
}