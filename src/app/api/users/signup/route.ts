import { NextRequest, NextResponse } from "next/server";
import User from '@/models/userModel'
import bcrypt from "bcryptjs";
import { uploadCloudinary } from "@/helpers/cloudinary";
import { dbConnect } from "@/dbConfig/dbConnect";

dbConnect()

export async function POST(request: NextRequest) {
    try {
        const reqBody:any = await request.json()
        const {username, email, password} = await reqBody
        
        if(
            [username, email, password].some((field) => {field?.trim() === ""})
        ) {
            return NextResponse.json({error: "Enter All Credentials"}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

       const profileImageLocalPath = reqBody.file?.profileImage[0]?.path
        if(!profileImageLocalPath){
            return NextResponse.json({error: "Profile Image is required"}, {status: 400})
        }

        const profileImage = await uploadCloudinary(profileImageLocalPath)
        if(!profileImage) {
           return NextResponse.json({error: ""}, {status: 400})
        }

        const coverImageLocalPath = reqBody.file?.coverImage[0]?.path
        if(!coverImageLocalPath){
            return NextResponse.json({})
        }

        const coverImage = await uploadCloudinary(coverImageLocalPath)
        if(!coverImage) {
           return NextResponse.json({})
        }
        const user = User.create({
            username,
            email,
            password: hashedPassword,
            profileImage: profileImage.url,
            coverImage: coverImage.url
        })
        //verification email
        return NextResponse.json({
            message: "User Signup Successfully",
            success: true,
            status: 200,
            data: user
        })
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500})
    }
}