"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import WriteUp from "../writeUp/page"
import Link from "next/link"
import BlogCard from "../components/BlogCard"

export interface Blog {
    _id: string;
    content: string;
    title: string;
    author: BlogUser;
    tags: [string]
}

export interface BlogUser {
    name: string;
    username: string;
    profileImage: string;
}

interface User {
    name: string;
    username: string;
    followers: number;
    following: number;
    coverImage: string;
    profileImage: string;
}

export default function Profile() {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User>({
        name: "Unknown",
        username: "Unknown",
        followers: 0,
        following: 0,
        coverImage: "",
        profileImage: ""
    })
    const [blogs, setBlogs] = useState<Blog[]>([])
    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true)
                const response = await axios.get('/api/users/profile', {
                    withCredentials: true,
                })
                setUser(response.data.data)
                console.log("Profile fetched successfully")
                toast.success("Profile fetched")
            } catch (error: any) {
                console.log("Failed to fetch profile")
                toast.error("Failed to fetch Profile")
            } finally {
                setLoading(false)
            }
        }
        const getBlogDisplay = async () => {
            try {
                const response = await axios.get('/api/users/blogDisplay')
                setBlogs(response.data.blogs)
                console.log("Fetched all blogs", response.data.message || "Blogs fetched", response.status)
                toast.success(response.data.message || "Blogs fetched")
            } catch (error: any) {
                toast.error("Failed to fetch blogs");
                console.error("Error fetching blogs:", error);
            }
        }
        getProfile()
        getBlogDisplay()
    }, [])


    return (
        <div>
            {loading ?
                <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full transition animate-spin"></div>
                    <div className="font-thin text-sm">Loading...</div>
                </div> :
                <div className="p-2">
                    <div className="mx-auto relative h-screen w-3/5 md:w-2/5 border border-white/0 rounded-xl bg-slate-800">
                        <div
                            className="w-full h-[300px] bg-cover bg-repeat bg-center border border-white/0 rounded-t-xl"
                            style={{ backgroundImage: `url(${user.coverImage || "https://images.pexels.com/photos/32356082/pexels-photo-32356082.jpeg"})` }}
                        >
                        </div>
                        <img
                            src={user.profileImage || "https://images.pexels.com/photos/32356082/pexels-photo-32356082.jpeg"}
                            className="m-0 w-[180px] h-[180px] border rounded-full relative top-[-50px] left-[30px]"></img>
                        <div className="m-0 w-[150px] h-[50px] absolute top-[320px] left-3/4">
                            <Link href='/writeUp'>
                                <button className="border px-4 mt-1 rounded-lg text-2xl bg-black/50">+</button>
                            </Link>
                        </div>
                        <div className="px-3 pb-4 w-full flex flex-col {justify-center gap-3">
                            <p className="text-3xl font-bold">{user.name}</p>
                            <p className="text-xl font-bold">@{user.username}</p>
                            <div className="w-full flex justify-evenly">
                                <div>
                                    <p>{user.followers}</p>
                                    <p>followers</p>
                                </div>
                                <div>
                                    <p>{user.following}</p>
                                    <p>following</p>
                                </div>
                            </div>
                            <button className="border rounded-md cursor-pointer">follow</button>
                        </div>
                    </div>
                    {Array.isArray(blogs) && blogs.length == 0 &&
                        <div className="text-center mt-2 ">
                            <p className="text-2xl font-sans font-extralight text-white/25">Write New Blogs</p>
                            <Link href='/writeUp'>
                                <button
                                    className="border px-4 mt-1 rounded-lg">+NEW BLOG</button>
                            </Link>
                        </div>
                    }
                    {Array.isArray(blogs) && blogs.length > 0 &&
                        <div className="flex flex-wrap mt-3 border w-3/5 mx-auto h-auto rounded-xl p-3">
                            {blogs.map((blog, index) => (
                                <BlogCard
                                    key={index}
                                    blog={blog}
                                />
                            ))}
                        </div>
                    }
                </div>
            }
        </div>
    )
}