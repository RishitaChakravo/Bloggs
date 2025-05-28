"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import {toast} from "react-hot-toast"

export default function SignUp(){
    const [disabled, setDisable] = useState(true)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [next, setNext] = useState(false)

    const onSignUp = async () => {
        setLoading(true)
        try {
            const response = await axios.post('/api/users/signup', data)
            console.log("Sign Up process done successfully", response)
            toast.success("Sign Up success")
        } catch (error: any) {
            console.error("Failed during SignUp process")
            toast.error(error?.response?.data?.message || "Sign up failed");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data.username.length > 0 && data.email.length > 0 && data.password.length > 0) {
            setDisable(false)        
        } else {
            setDisable(true)
        }
    }, [data])
    return(
        <div className="flex flex-col justify-center items-center min-h-screen">
            {!next && <div className="flex flex-col items-center justify-center border border-gray-400 p-5 rounded-xl">
                <p>{loading ? "Procssing" : "SIGNUP"}</p>
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
            {next && <div className="flex flex-col items-center justify-center border border-gray-400 p-5 rounded-xl">
                <label htmlFor="profileImage">Profile Image</label>
                <input type="file"/>
                <label htmlFor="coverImage">Cover Image</label>
                <input type="file"/>
                <button onClick={onSignUp} className="border m-2 py-2 px-5 rounded-full hover:bg-white/10  active:bg-white active:text-black">{disabled ? "Fill form" : "SignUp"}</button>
            </div>}
            <p className="mt-2">Already have an account?  
                    <Link href="/login" className="hover:text-gray-400"> LOGIN</Link>
            </p>
        </div>
    )
}