'use client'

import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function PASSWORDRESET() {
    const [enteredPass, setEnteredPass] = useState<string>("")
    const [confirmedPass, setConfirmPass] = useState<string>("")
    const searchParams = useSearchParams()
    const [email, setEmail] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const mail = searchParams.get('email')
        setEmail(mail)
    }, [])


    const changePassword = async () => {
        if(enteredPass !== confirmedPass) {
            setEnteredPass("")
            setConfirmPass("")
            toast.error("Password incorrect")
            return
        }

        try {
            const response = await axios.post('/api/users/changePassword', {email, newPassword: confirmedPass})
            if(response.data.success){
                toast.success("Password Changed")
                router.push('/login')
            } else {
                toast.error(response.data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Server error", error instanceof Error ? error.message : error);
        } 
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-800 via-slate-900">
            <div className="py-4 px-6 rounded-xl flex flex-col gap-2 bg-gray-500/20">
                <p className="font-bold text-2xl text-gray-300">Password Reset</p>
                <label htmlFor="enter" className="mt-3 block text-sm font-medium text-gray-500">Enter password</label>
                <input
                    type="password"
                    id="enter"
                    value={enteredPass}
                    onChange={(e) => setEnteredPass(e.target.value)}
                    className="text-black"
                />
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-500">Confirm Password</label>
                <input
                    type="password"
                    id="confirm"
                    value={confirmedPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="mb-3 text-black"
                />
                <button
                    onClick={changePassword}
                    className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition duration-200"
                >
                    Change Password
                </button>
            </div>
        </div>
    )
}
