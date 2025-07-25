import { NextRequest, NextResponse } from "next/server";
import OTP from '@/models/otpModel'
import bcrypt from "bcryptjs";
import { dbConnect } from "@/dbConfig/dbConnect";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const reqBody = await request.json()
        const { email } = reqBody

        const otp = Math.floor(100000 + Math.random()*900000).toString()
        const res = await fetch('https://sandbox.api.mailtrap.io/api/send/3910476', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: {
                    email: "hello@example.com",
                    name: "BLOGGS"
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: "Password Reset",
                text: `We received a request to reset your password.
                Your One-Time Password (OTP) is: ${otp}
                Please enter this OTP on the password reset page. This code will expire in 10 minutes.
                If you did not request a password reset, you can safely ignore this email.
                Thanks,
                The BLOGGS Team`
                ,
                category: "Password Reset"
            })
        })

        if(!res.ok) {
            throw new Error("Failed to send OTP email")
        }
        await OTP.deleteMany({ email })

        const hashedOtp = await bcrypt.hash(otp, 10)
        
        const otpDoc = await OTP.create({
            email: email,
            otpHash: hashedOtp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        })

        return NextResponse.json({
            message: "mail was sent successfully",
            success: true,
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}