import { dbConnect } from "@/dbConfig/dbConnect";
import OTP from "@/models/otpModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const reqBody = await request.json()
        const { email, enteredOtp } = reqBody

        const otpDoc = await OTP.findOne({ email })

        if (!otpDoc) {
            return NextResponse.json({
                message: "OTP not found or expired",
                success: false,
            }, { status: 404 })
        }

        if (Date.now() > otpDoc.expiresAt.getTime()) {
            return NextResponse.json({
                message: "OTP expired",
                success: false,
            }, { status: 410 })
        }

        const otpCompare = await bcrypt.compare(enteredOtp, otpDoc.otpHash)

        if (!otpCompare) {
            return NextResponse.json({
                message: 'Invalid Otp',
                success: false,
            }, { status: 400 })
        }

        await OTP.deleteOne({ email })

        return NextResponse.json({
            message: "Valid OTP",
            success: true,
        }, { status: 200 })
    } catch (error) {
        console.error(error instanceof Error ? error.message : error)
        return NextResponse.json({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }

}
