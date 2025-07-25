'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function FORGOT() {
    const [email, setEmail] = useState<string>("")
    const [enteredOtp, setEnteredOtp] = useState<string>("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const sendEmail = async () => {
        try {
            if (email?.trim() === "") {
                toast.error("Email is required")
                return
            }

            setLoading(true)

            const response = await axios.post('/api/users/passwordReset', { email })
            toast.success("Otp sent to your Email")
            console.log(response.data.message)
            setSuccess(response.data.success)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const compareOtp = async () => {
        if (enteredOtp.trim().length !== 6) {
            toast.error("Please enter a 6-digit OTP")
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('/api/users/verifyOtp', { email, enteredOtp })
            if (response.data.success) {
                toast.success(response.data.message)
                router.push(`/forgotPassword/step2?email=${encodeURIComponent(email)}`)
            } else {
                toast.error(response.data.message)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex flex-col justify-center items-center ${success ? 'bg-gradient-to-t from-slate-800 ' : 'bg-gradient-to-b from-slate-800'}`}>
            {success ? (
                <div className="max-w-md mx-auto mt-10 bg-gray-500/10 shadow-md rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-300">Verify OTP</h2>

                    <p className="text-sm text-gray-400">
                        OTP sent to: <strong className="text-white">{email}</strong>
                    </p>

                    <div className="space-y-2">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-500">
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            type="number"
                            maxLength={6}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder-gray-400"
                        />
                    </div>

                    <button
                        onClick={compareOtp}
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-medium transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </div>


            ) : (
                <div className="max-w-md mx-auto mt-10 bg-gray-500/10 shadow-md rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-300">Reset Password</h2>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                        />
                    </div>

                    <button
                        onClick={sendEmail}
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-medium transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>
            )}
            <Toaster position="bottom-right"
                toastOptions={{ style: { zIndex: 9999 } }}
            />
        </div>
    )
}