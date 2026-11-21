import { dbConnect } from "@/dbConfig/dbConnect";
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'

dbConnect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {token} = await reqBody

        const user = await User.findOne({verifyToken : token,
            verifyToeknExpiry: {$gt: Date.now()}
        })
        console.log(user)
        if(!user){
            return NextResponse.json({error: "Invalid Token"}, {status: 400})
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save({validateBeforeSave: false})

        return NextResponse.json({
            message : "Email verified successfully",
            success: true
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Internal Server error"}, {status: 500})
    }
}
