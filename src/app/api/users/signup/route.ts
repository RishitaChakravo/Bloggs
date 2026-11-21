
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { uploadCloudinary } from "@/helpers/cloudinary";
import { dbConnect } from "@/dbConfig/dbConnect";
import { parseForm } from "@/lib/parseForm";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { fields, files } = await parseForm(request);

        const { name, username, email, password } = fields;

        if (
            [name, username, email, password].some(
                (field) => !field || field.trim() === ""
            )
        ) {
            return NextResponse.json(
                { error: "Enter All Credentials" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileImageLocalPath = files.profileImage?.[0]?.filepath;

        if (!profileImageLocalPath) {
            return NextResponse.json(
                { error: "Profile Image is required" },
                { status: 400 }
            );
        }

        // Upload profile image
        const profileImage = await uploadCloudinary(profileImageLocalPath);

        if (!profileImage?.url) {
            return NextResponse.json(
                { error: "Profile image upload failed" },
                { status: 400 }
            );
        }

        const coverImageLocalPath = files.coverImage?.[0]?.filepath;

        let coverImageUrl: string | undefined;

        if (coverImageLocalPath) {
            const coverImage = await uploadCloudinary(coverImageLocalPath);

            if (!coverImage?.url) {
                return NextResponse.json(
                    { error: "Cover image upload failed" },
                    { status: 400 }
                );
            }

            coverImageUrl = coverImage.url;
        }

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            profileImage: profileImage.url,
            ...(coverImageUrl && { coverImage: coverImageUrl })
        });


        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json(
            {
                message: "User Signup Successfully",
                success: true,
                data: userResponse
            },
            { status: 201 }
        );

    } catch (err: unknown) {
        console.error("Signup Error:", err);

        return NextResponse.json(
            {
                error: err instanceof Error
                    ? err.message
                    : "Internal server error"
            },
            { status: 500 }
        );
    }
}
