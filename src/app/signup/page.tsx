"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"

export default function SignUp() {
    const router = useRouter()
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [disabled, setDisable] = useState(true)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    })
    const [next, setNext] = useState(false)

    const onSignUp = async () => {
        if (!profileImage || !coverImage) {
            toast.error("Please upload both images")
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("username", data.username)
            formData.append("email", data.email)
            formData.append("password", data.password)
            formData.append("profileImage", profileImage)
            formData.append("coverImage", coverImage)

            const response = await axios.post('/api/users/signup', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            toast.success("Sign Up successful!")
            console.log("Signup response:", response.data)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
                toast.error("Sign up failed")
            } else {
                console.log("An unexpected error occurred");
            }
        } finally {
            setLoading(false)
            router.push('/login')
        }
    }

    useEffect(() => {
        if (data.username && data.email && data.password && data.name) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [data])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 text-white">
            {!next ? (
                <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700 text-white">
                    <h2 className="text-3xl font-semibold text-center mb-6">Create Your Account</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Name</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                                id="name"
                                placeholder="Your name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Username</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                                id="username"
                                placeholder="Choose a username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData({ ...data, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                                id="email"
                                placeholder="Your email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Password</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                                id="password"
                                placeholder="Create a password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={() => setNext(true)}
                            className="w-full mt-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
                            disabled={disabled}
                        >
                            {disabled ? "Complete the form" : "Next"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700 text-white space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Upload Images</h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-100 file:text-violet-700
                            hover:file:bg-violet-200"
                        />
                        {profileImage && (
                            <img
                                src={URL.createObjectURL(profileImage)}
                                alt="Profile Preview"
                                className="mt-2 rounded-lg h-24 w-24 object-cover border border-white/20"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-emerald-100 file:text-emerald-700
                            hover:file:bg-emerald-200"
                        />
                        {coverImage && (
                            <img
                                src={URL.createObjectURL(coverImage)}
                                alt="Cover Preview"
                                className="mt-2 rounded-lg h-24 w-full object-cover border border-white/20"
                            />
                        )}
                    </div>

                    <button
                        onClick={onSignUp}
                        disabled={disabled || loading}
                        className={`w-full mt-4 py-2 rounded-full font-semibold transition ${disabled || loading
                                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </div>
            )}

            <p className="mt-6 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
            </p>
            <Toaster position="bottom-right"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: 'green',
                            color: 'white',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: 'red',
                            color: 'white',
                        },
                    },
                }} />
        </div>
    )
}
