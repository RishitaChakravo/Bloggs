"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Profile(){
    const [user, setUser] = useState({})
    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile')
                setUser(response.data)
                console.log("Profile fetched successfully")
                toast.success("Profile fetched")
            } catch (error: any) {
                console.log("Failed to fetch profile")
                toast.error("Failed to fetch Profile")
            }
        }

        // getProfile()
    }, [])
    return(
        <div className="">
            <div className="mx-auto h-screen w-4/5 border border-white/0 rounded-xl bg-slate-800">
                <div 
                className="w-full h-[300px] bg-cover bg-repeat bg-center border border-white/0 rounded-t-xl"
                style = {{backgroundImage: "url('https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg')"}}
                >    
                </div>
                <div className="m-0 w-[180px] h-[180px] border rounded-full bg-indigo-500 relative top-[-50px] left-[30px]"></div>
                <div className="px-3 pb-4">
                    <p className="text-3xl font-bold">User Name</p>
                    <div className="w-full flex justify-evenly">
                        <div>
                        <p>0</p>
                        <p>followers</p>
                    </div>
                    <div>
                        <p>0</p>
                        <p>following</p>
                    </div>
                    </div>
                    <button className="mx-auto">follow</button>
                </div>
            </div>
        </div>
    )
}