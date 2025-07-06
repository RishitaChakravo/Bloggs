import Blog from "@/models/blogModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {blogId, info} = await request.json()
        if(!blogId || !info) {
            return NextResponse.json({error: "Incomplete like request"}, {status: 400})
        }

        let blog

        if(info === 'like') {
            blog = await Blog.findByIdAndUpdate(blogId,
                {$inc: {likes: 1}},
                {new: true}
            )
        } else if (info === 'unlike') {
            blog = await Blog.findByIdAndUpdate(blogId,
                {$inc: {likes: -1}},
                {new: true}
            )
        }

        return NextResponse.json({
            message: "",
            success: true,
            data: blog
        }, {status: 200})
    } catch (error:any) {
        return NextResponse.json({
            error: error.message || "Something went wrong",
            success: false
        }, { status: 500 });
    }
}