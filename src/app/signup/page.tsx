"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {toast} from "react-hot-toast"

export default function SignUp(){
    const router = useRouter()
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [disabled, setDisable] = useState(true)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name:"",
        username: "",
        email: "",
        password: "",
    })
    const [next, setNext] = useState(false)

    const onSignUp = async () => {
        if (!profileImage || !coverImage) {
            toast.error("Please upload both images")
            return;
        }

        setLoading(true)
        
        try {
            const formData = new FormData();
            formData.append("name", data.name)
            formData.append("username", data.username)
            formData.append("email", data.email)
            formData.append("password", data.password)
            formData.append("profileImage", profileImage)
            formData.append("coverImage", coverImage) 

            const response = await axios.post('/api/users/signup', formData, {
                headers: {
                    "Content-Types" : "multipart/form-data",
                }
            })

            toast.success("Sign Up successful!")
            console.log("Signup response:", response.data)
        } catch (error: any) {
            console.error("Failed during SignUp process", error)
            toast.error(error?.response?.data?.message || "Sign up failed");
        } finally {
            setLoading(false)
            router.push('/login')
        }
    }

    useEffect(() => {
        if (data.username.length > 0 && data.email.length > 0 && data.password.length > 0 && data.name.length > 0) {
            setDisable(false)        
        } else {
            setDisable(true)
        }
    }, [data])
    return(
        <div className="flex flex-col justify-center items-center min-h-screen bg-black">
            {!next && <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-neutral-900">
                <p>{loading ? "Procssing" : "SIGNUP"}</p>
                <label htmlFor="name">Name</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white"
                id="name"
                placeholder="name"
                value={data.name}
                onChange={(e) => {setData({...data, name: e.target.value})}}
                type="text"
                />
                <label htmlFor="username">Username</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white"
                id="username"
                placeholder="username"
                value={data.username}
                onChange={(e) => {setData({...data, username: e.target.value})}}
                type="text"
                />
                <label htmlFor="email">Email</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white"
                id="email"
                placeholder="email"
                value={data.email}
                onChange={(e) => {setData({...data, email: e.target.value})}}
                type="email"
                />
                <label htmlFor="password">Password</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white"
                id="password"
                placeholder="password"
                value={data.password}
                onChange={(e) => {setData({...data, password: e.target.value})}}
                type="password"
                />
                <hr/>
                <button onClick={() => {setNext(true)}} className="border m-2 py-2 px-5 rounded-full hover:bg-white/10  active:bg-white active:text-black">Next</button>
            </div>}
            {next && (
            <div className="flex flex-col items-center justify-center bg-neutral-900 border border-gray-600 p-6 rounded-xl w-[90%] md:w-[400px] gap-5 shadow-lg">
                
                <div className="w-full">
                <label className="block mb-1 text-sm font-semibold text-gray-200" htmlFor="profileImage">
                    Profile Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="profileImage"
                    onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    "
                />
                {profileImage && (
                    <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile Preview"
                    className="mt-2 rounded-lg h-24 w-24 object-cover border border-white/10"
                    />
                )}
                </div>

                <div className="w-full">
                <label className="block mb-1 text-sm font-semibold text-gray-200" htmlFor="coverImage">
                    Cover Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="coverImage"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-emerald-50 file:text-emerald-700
                    hover:file:bg-emerald-100
                    "
                />
                {coverImage && (
                    <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover Preview"
                    className="mt-2 rounded-lg h-24 w-full object-cover border border-white/10"
                    />
                )}
                </div>

                <button
                onClick={onSignUp}
                className="mt-4 border px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50"
                disabled={disabled}
                >
                {disabled ? "Fill form" : "Sign Up"}
                </button>
            </div>
            )}

            <p className="mt-2">Already have an account?  
                    <Link href="/login" className="hover:text-gray-400"> LOGIN</Link>
            </p>
        </div>
    )
}