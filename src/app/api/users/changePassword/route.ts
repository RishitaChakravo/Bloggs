import { dbConnect } from "@/dbConfig/dbConnect";
import OTP from "@/models/otpModel";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    await OTP.deleteOne({ email }); 

    return NextResponse.json(
      { message: "Password updated successfully", success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
      if (error instanceof Error) {
          console.log(error.message);
      } else {
          console.log("An unexpected error occurred");
      }
  }
}
