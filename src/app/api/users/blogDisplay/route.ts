import { dbConnect } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function GET(request: NextRequest, {params}: {params: {username: string}}) {
    try {
        const {searchParams} = new URL(request.url)
        const username = searchParams.get("username")
        
        let userId

        if (!username) {
            const token = request.cookies.get("token")?.value;
            if (!token) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
            userId = await getDataFromToken(token);
        
        } else {
            
            const user = await User.findOne({ username });
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
            userId = user._id;
        }

        const blogs = await Blog.aggregate([
            {
               $match: {
                author: mongoose.Types.ObjectId.createFromHexString(userId!)
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
                        name: "$authorDetails.name",
                        username: "$authorDetails.username",
                        email: "$authorDetails.email"
                    }
                }
            },
            {
                $project: {
                    authorDetails: 0,
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        return NextResponse.json({
            message: "All blogs successfully fetched",
            success: true,
            data: blogs
        }, {status: 200})
    } catch (error: any) {
        return NextResponse.json({message: "error"}, {status: 500})       
    }
}