import User from "@/models/userModel";
import Blog from "@/models/blogModel"
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from 'mongoose'
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest){
    await dbConnect()
    try {
        const reqbody: any = await request.json()
        const {content, tags, title} = await reqbody

        if(!content || !tags || !title ){
            return NextResponse.json({error: "Enter all data to form the blog"}, {status: 400})
        }

        const token = request.cookies.get('token')?.value
        const userId = await getDataFromToken(token!)

        const blog = await Blog.create({
            title,
            content,
            tags,
            author: userId
        })

        const finalBlog = await Blog.aggregate([
            {
                $match: {
                    _id: blog._id
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            }, 
            {
                $unwind: "$authorDetails"
            }, 
            {
                $addFields: {
                    author: "$authorDetails"
                }
            },
            {
                $project: { authorDetails: 0 }
            }
        ])

        return NextResponse.json({
            message: "Blog Created!!",
            success: true,
            data: finalBlog[0]
        }, {status: 200})

    } catch (error: any) {
        console.error("Blog creation failed", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );   
    }
}