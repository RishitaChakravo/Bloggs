"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"

export default function UserIcon() {
    const [hidden, setHidden] = useState(true)
    const [user, setUser] = useState({
        username: "",
        email: "",
        profileImage: ""
    })

    const logout = async () => {
        try {
            const response = await axios.post('/api/users/logout')
            console.log("Successfully logged out", response.data)
        } catch (error) {
            console.error("Failed to logout", error instanceof Error ? error.message : error)
        }
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile', {
                    withCredentials: true,
                })
                setUser(response.data.data)
            } catch (error) {
                console.log("User Data not fetched", error instanceof Error ? error.message : error)
            }
        }

        getProfile();
    }, [])

    return (
        <>
            <div className="fixed top-5 right-1 z-[10000]">
                {hidden && (
                    <button onClick={() => setHidden(false)}>
                        <img
                            src={user.profileImage || "https://th.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?w=190&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7"}
                            alt="User Icon"
                            className="rounded-full w-14 h-14 object-cover"
                        />
                    </button>
                )}
            </div>

            {!hidden && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
                        onClick={() => setHidden(true)}
                    ></div>

                    {/* Sidebar */}
                    <div className="bg-white/20 backdrop-blur-md shadow-2xl p-6 w-[300px] min-h-screen fixed top-0 right-0 z-[9999] rounded-l-2xl border-l border-white/30 text-white flex flex-col justify-between">

                        {/* Profile Section */}
                        <div className="flex flex-col items-center">
                            <Link href={`/profile`}>
                                <button onClick={() => setHidden(true)}>
                                    <img
                                        src={user.profileImage || "https://th.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?w=190&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7"}
                                        className="rounded-full w-20 h-20 object-cover mb-3 border-4 border-white"
                                        alt="User Profile"
                                    />
                                </button>
                                <p className="text-lg font-semibold">{user.username}</p>
                            </Link>
                            <p className="text-sm text-gray-200">{user.email}</p>
                            <hr className="w-full border-gray-300 mt-4 mb-3" />
                        </div>

                        {/* Links */}
                        <div className="space-y-4 text-md">
                            <div className="sm:hidden flex flex-col">
                                <Link href="/profile" className="hover:underline hover:text-blue-200 transition">
                                    My Profile
                                </Link>
                                <Link href="/search" className="hover:underline hover:text-blue-200 transition">
                                    Search
                                </Link>
                                <Link href="/blogPage" className="hover:underline hover:text-blue-200 transition">
                                    Blogs
                                </Link>
                            </div>
                            <div>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}
