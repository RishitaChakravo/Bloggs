'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function FORGOT() {
    const [email, setEmail] = useState<string>("")
    const [otp, setOtp] = useState<string>("")
    const [enteredOtp, setEnteredOtp] = useState<string>("")

    const router = useRouter()

    const sendEmail = async () => {
        try {
            if (email?.trim() !== "") {
                const response = await axios.post('/api/users/passwordReset', { email })
                toast.success("Otp sent to your Email")
                console.log(response.data.message)
                setOtp(response.data.otp)
            } else {
                toast.error("Email is required")
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const compareOtp = () => {
        if (otp == enteredOtp) {
            toast.success("valid OTP")
            router.push('/forgotPassword/step2')
        } else {
            toast.error('Invalid OTP')
        }
    }

    return (
        <>
            {otp ? (
                <div>
                    <input
                        type="number"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <button
                        onClick={compareOtp}
                    >Verify OTP</button>
                </div>
            ) : (
                <div>
                    <p>Email</p>
                    <input
                        maxLength={6}
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter valid email" />
                    <button
                        onClick={sendEmail}
                    >Send OTP</button>
                </div>
            )}
            <Toaster position="bottom-right"
                toastOptions={{ style: { zIndex: 9999 } }}
            />
        </>
    )
}