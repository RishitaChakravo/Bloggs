import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer'

export async function sendEmail({email, userId, emailType}: {email: string, userId: string, emailType: string}) {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        if(emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                $set : {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            })
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "7678d14aa927d6",
                pass: "0eb4dbb91f7598"
            }
        });

        const mailOptions = {
            from: 'chak@rishita.ai',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your passwrod",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifymail?token=${hashedToken}/">here</a> 
             to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
        }

        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse
    } catch (error) {
        console.error(error instanceof Error ? error.message : error)
    }
}
