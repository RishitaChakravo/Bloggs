'use client'

import axios from "axios";
import { Playfair_Display } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import { useEffect, useState } from "react";
import { Blog } from "../search/page";
import BlogCard from "../components/BlogCard";
import BlogCard2 from "../components/BlogCard2";

const dancing = Dancing_Script({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>()
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
    const [query, setQuery] = useState("")

    useEffect(() => {
        const displayBlogs = async () => {
            try {
                const endpoint = query.trim() ? `/api/users/searchBar?query=${encodeURIComponent(query)}` : '/api/users/blogPage'
                const response = await axios.get(endpoint)
                console.log(`${response.status}: blogs displayed`, response.data.message)
                setBlogs(response.data.blogs)
            } catch (error: any) {
                console.error("Blogs not displayed", error.message)
            }
        }

        displayBlogs()
    }, [])
    return (
        <>
            {selectedBlog && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
                <button onClick={() => setSelectedBlog(null)} className="flex justify-center items-center fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md text-white text-3xl md:text-4xl h-14 w-14 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200">⇦</button>
                <div>
                    <BlogCard2 blog={selectedBlog} />
                </div>
            </div>}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-10">
                <div>
                    {/* searchBar */}
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search blogs, tags..."
                        className="rounded-lg mx-auto block md:w-2/5 w-3/5 px-5 h-10 my-2 bg-zinc-800 text-white placeholder-gray-400 border border-zinc-600"
                    />
                </div>

                {/* QUOTE SECTION */}
                <div className="text-center my-10">
                    <p
                        className={`text-5xl md:text-7xl font-extralight leading-tight ${playfair.className}`}
                    >
                        Dive into a world of ideas
                    </p>

                    <svg
                        viewBox="0 0 500 120"
                        className="w-full h-28"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <path
                                id="curve"
                                d="M 50 80 Q 250 140 450 80"
                                fill="transparent"
                            />
                        </defs>
                        <text
                            className={`fill-white text-[25px] md:text-[30px] font-normal ${dancing.className}`}
                        >
                            <textPath href="#curve" startOffset="50%" textAnchor="middle">
                                search anything, discover everything
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* BLOG SECTION */}
                <div
                    className="flex flex-wrap justify-center gap-3 p-3 w-[95%] bg-gradient-to-t from-[#1a0036] to-[#010924] min-h-[600px] h-auto rounded-t-3xl mx-auto">
                    {blogs?.map((blog, idx) => (
                        <div
                            key={idx}
                            className="cursor-pointer"
                            onClick={() => setSelectedBlog(blog)}
                        >
                            <BlogCard blog={blog} />
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}
