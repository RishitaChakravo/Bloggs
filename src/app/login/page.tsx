"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Login(){
    const [disabled, setDisable] = useState(true)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })

    const onLogin = async () => {
        if(!disabled) {
            setLoading(true)
        }
        try {
            const response = await axios.post("/api/users/login", userData)
            console.log("Logged In Successfully", response)
            toast.success("LoggedIn succesfully")
        } catch (error: any) {
            toast.error("Failed login process")
        }
    }

    useEffect(() => {
        if(userData.email.length > 0 && userData.password.length > 0){
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [userData])
    return(
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col justify-center items-center gap-2 border border-gray-400 p-5 my-2 rounded-xl">
                <p>{loading ? "Processing" : "LOGIN"}</p>
                <label htmlFor="email">Email</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white"
                id="email"
                placeholder="email"
                type="email"
                value={userData.email}
                onChange={(e) => {setUserData({...userData, email: e.target.value})}}
                />
                <label htmlFor="password">Password</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white"
                id="password"
                placeholder="password"
                type="password"
                value={userData.password}
                onChange={(e) => {setUserData({...userData, password: e.target.value})}}
                />
                <button onClick={onLogin}
                className="border py-2 px-5 my-2 rounded-full hover:bg-white/10 active:bg-white active:text-black"
                >{disabled ? "Fill form" : "Login"}</button>
            </div>
            <p>Don't have account?
                <Link
                className="hover:text-gray-400" 
                href="/signup"> SignUp</Link>
            </p>
        </div>
    )
}