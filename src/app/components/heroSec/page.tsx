"use client"

import { useRouter } from "next/navigation";
import { AuroraBackground } from "../ui/aurora-background";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HeroSec() {
    const router = useRouter()
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const logincheck = async () => {
            try {
                const response = await axios.get('/api/users/loginCheck')
                console.log(response.data.message)
                setSuccess(response.data.success)
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setSuccess(false);
                } else {
                    console.error("Unexpected error in login check:", error.message);
                }
            }
        }

        logincheck()
    }, [])

    return (
        <AuroraBackground>
            <div className="flex w-full md:w-3/5 flex-col justify-center items-center mx-auto">
                <h1 className="text-white font-bold text-3xl sm:text-6xl text-center">Discover Stories Worth Sharing</h1>
                <p className="my-2 text-gray-300 text-center font-mono font-thin text-xl">Read blogs from passionate writers across tech, travel, life & more. Or start writing your own.</p>
                <div className="flex justify-evenly w-3/5">
                    <Link href={success ? '/blogPage' : '/login'}>
                        <button className="text-xl text-white border border-white px-7 py-2 rounded-full bg-black/50 hover:bg-black hover:cursor-pointer transition-all duration-300">Explore Blogs</button>
                    </Link>
                    <Link href={success ? '/writeUp' : '/login'}>
                        <button
                            className="text-xl text-gray-800 border px-7 py-2 rounded-full bg-white hover:bg-transparent hover:text-white transition duration-300">Start Writing</button>
                    </Link>
                </div>
            </div>
        </AuroraBackground>
    )
}