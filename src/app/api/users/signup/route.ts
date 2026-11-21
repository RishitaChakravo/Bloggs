import { NextRequest, NextResponse } from "next/server";
import User from '@/models/userModel'
import bcrypt from "bcryptjs";
import { uploadCloudinary } from "@/helpers/cloudinary";
import { dbConnect } from "@/dbConfig/dbConnect";
import { parseForm } from "@/lib/parseForm";

export const config = {
  api: {
    bodyParser: false
  }
};

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const {fields, files} = await parseForm(request)
 
        const {name, username, email, password} = fields
        
        if(
            [name, username, email, password].some((field) => {field?.trim() === ""})
        ) {
            return NextResponse.json({error: "Enter All Credentials"}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

       const profileImageLocalPath = files.profileImage?.[0]?.filepath
        if(!profileImageLocalPath){
            return NextResponse.json({error: "Profile Image is required"}, {status: 400})
        }

        const profileImage = await uploadCloudinary(profileImageLocalPath)
        if(!profileImage) {
           return NextResponse.json({error: ""}, {status: 400})
        }

        const coverImageLocalPath = files?.coverImage?.[0]?.filepath;
        if(!coverImageLocalPath){
            return NextResponse.json({})
        }

        const coverImage = await uploadCloudinary(coverImageLocalPath)
        if(!coverImage) {
           return NextResponse.json({})
        }
        const user = User.create({
            name,
            username,
            email,
            password: hashedPassword,
            profileImage: profileImage?.url,
            coverImage: coverImage?.url
        })
        //verification email
        return NextResponse.json({
            message: "User Signup Successfully",
            success: true,
            status: 200,
            data: user
        })
    } catch (err) {
        return NextResponse.json({error: err instanceof Error ? err.message : "Internal server error"}, {status: 500})
    }
}
