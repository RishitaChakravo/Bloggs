"use client"

import { useState } from "react"
import Link from "next/link"
import axios from "axios"

export default function UserIcon() {
    const [hidden, setHidden] = useState(true)

    const logout = async () => {
        try {
            const response = await axios.post('/api/users/logout')
            console.log("Successfully logged out", response)
        } catch (error: any) {
            console.error("Failed to logout", error)
        }
    }

    return (
        <>
            <div className="fixed top-5 right-1 z-[10000]">
                {hidden && (
                <button onClick={() => setHidden(false)}>
                    <img
                    src="https://th.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?w=190&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                    alt="User Icon"
                    className="rounded-full w-14"
                    />
                </button>
                )}
            </div>

            {!hidden &&
                (<><div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
                    onClick={() => setHidden(true)}
                ></div>
                    <div className="bg-blue-200/50 p-3 w-auto min-h-screen fixed top-0 right-0 z-[9999]">
                        <div className="flex flex-col items-center mb-2">
                            <button onClick={() => { setHidden(!hidden) }}>
                                <img src="https://th.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?w=190&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                                    className="rounded-full w-14 mb-2"
                                >
                                </img>
                            </button>
                            <hr className="w-full" />
                        </div>
                        <ul className="mr-20">
                            <li><Link href="">My Profile</Link></li>
                            <li><button onClick={logout}>LOGOUT</button></li>
                        </ul>
                    </div></>
                )}
        </>
    )
}