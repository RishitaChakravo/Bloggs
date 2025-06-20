import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value
        const userId = await getDataFromToken(token!)
        const user = await User.findById(userId)
        if(!user) {
            NextResponse.json({message: "Error"}, {status: 500})
        }

        const blogs = Blog.aggregate([
            {
               $match: {
                author: new mongoose.Types.ObjectId(userId!)
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
                    author: {
                        username: "$authorDetails.username",
                        email: "$authorDetails.email"
                    }
                }
            },
            {
                $project: {
                    authorDetails: 0,
                }
            }
        ])

        return NextResponse.json({
            message: "",
            success: true,
            data: blogs
        }, {status: 200})
    } catch (error: any) {
        NextResponse.json({message: "error"}, {status: 500})       
    }
}