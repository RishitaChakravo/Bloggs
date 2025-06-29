import { dbConnect } from "@/dbConfig/dbConnect";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export default async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url);
        const prompt = searchParams.get("query");

        if(!prompt) {
            return NextResponse.json({message:"No search material"}, {status:400})
        }

        const blogs =await Blog.find([
            {
                $or:[
                    {author: new RegExp(prompt, 'i')},
                    {title: new RegExp(prompt, 'i')},
                    {content: new RegExp(prompt, 'i')},
                    {tags: {$in: [new RegExp(prompt, 'i')]}}
                ]
            }
        ])
        
        const users =await User.find({
            username: new RegExp(prompt, 'i')
        })

        return NextResponse.json({
            message:"Search succesful",
            success: true,
            blogs,
            users
        }, {status: 200})
    } catch (error: any) {
        return NextResponse.json({message:"Failed while searching"}, {status:500})
    }
}