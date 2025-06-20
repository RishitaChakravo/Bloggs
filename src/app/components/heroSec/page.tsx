"use client"

import { useRouter } from "next/navigation";
import { AuroraBackground } from "../ui/aurora-background";
import Link from "next/link";

export default function HeroSec(){
    const router = useRouter()
    
    return(
        <AuroraBackground>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-white font-bold text-3xl sm:text-6xl text-center">Discover Stories Worth Sharing</h1>
            <p className="my-2 text-gray-300 text-center font-mono font-thin text-xl">Read blogs from passionate writers across tech, travel, life & more. Or start writing your own.</p>
            <div className="flex justify-evenly w-3/5">
                <button className="text-xl text-white border border-white px-7 py-2 rounded-full bg-black/50 hover:bg-black hover:cursor-pointer transition-all duration-300">Explore Blogs</button>
                <Link href="/signup">
                    <button
                    className="text-xl text-gray-800 border px-7 py-2 rounded-full bg-white hover:bg-transparent hover:text-white transition duration-300">Start Writing</button>
                </Link>
            </div>
            </div>
        </AuroraBackground>
    )
}