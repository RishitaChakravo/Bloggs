'use client'

import axios from "axios";
import { BookText, FileText, Newspaper } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavProp {
    isLoggedIn?: boolean;
    showButton?: boolean
}

export function NavBar({ isLoggedIn, showButton = true }: NavProp) {
    const [success, setSuccess] = useState(false)

    const logout = async () => {
        try {
            const response = await axios.post('/api/users/logout')
            console.log(response.data.message)
        } catch (error: any) {
            console.log(error.message)
        } finally {
            window.location.href = '/'
        }
    }

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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black shadow-lg px-10 py-3 
        text-center sm:flex items-center justify-between rounded-full w-[50%] max-w-5xl sm:w-[80%] md:w-[60%]">
            <div>
                <p className="text-3xl text-blue-600 font-mono font-bold">bloggs</p>
            </div>
            {success && <div className="w-auto gap-4 hidden sm:flex">
                <Link href="/">
                    <button>
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" alt="Home" width="20" height="20" />
                    </button>
                </Link>
                <Link href="/search">
                    <button>
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/search--v1.png" alt="Search" width="20" height="20"></img>
                    </button>
                </Link>
                <Link href='/blogPage'>
                    <Newspaper className="w-5 h-5" />
                </Link>
            </div>}
            {showButton && <div>
                {isLoggedIn ?
                    <button onClick={logout}
                        className="text-white-600 hidden sm:block border px-4 py-1 rounded-full hover:bg-red-600 hover:border-red-600 hover:text-white transition"
                    >
                        LOGOUT
                    </button> :
                    <div className="flex w-auto gap-2">
                        <Link href="/signup">
                            <button className="text-blue-600 hidden sm:block border border-blue-600 px-4 py-1 rounded-full hover:bg-blue-600 hover:text-white transition">Sign Up</button>
                        </Link>
                        <Link href="/login">
                            <button className="text-blue-600 hidden sm:block border border-blue-600 px-4 py-1 rounded-full hover:bg-blue-600 hover:text-white transition">Login</button>
                        </Link>
                    </div>}
            </div>}
        </div>
    );
}
