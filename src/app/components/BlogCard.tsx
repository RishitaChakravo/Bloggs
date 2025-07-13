'use client'

import { BlogUser } from "../search/page";
import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface Blog {
    _id: string;
    content: string;
    title: string;
    author: BlogUser;
    tags: string[];
    hasLiked: boolean;
    likes:number;
}

interface Props {
    blog: Blog
}

export default function BlogCard({ blog }: Props) {
    const limit = 100
    const isLong = blog.content.length > 100
    const [expanded, setExpanded] = useState(false)
    const [liked, setLiked] = useState(blog.hasLiked)
    const [likesCount, setLikesCount] = useState(blog.likes ?? 0)

    const toggleExpand = () => { setExpanded(!expanded) }
    const onLike = async () => {
        try {
            if (!liked) {
                const response = await axios.post('/api/users/Likes/like', { blogId: blog._id })
                console.log(response.data.message)
                setLiked(true)
                setLikesCount(prev => prev + 1)
            } else {
                const response = await axios.post('/api/users/Likes/dislike', { blogId: blog._id })
                console.log(response.data.message)
                setLiked(false)
                setLikesCount(prev => prev - 1)
            }
        } catch (error: any) {
            console.log("Like/Unlike process failed", error.message)
        }
    }
    return (
        <div className="h-auto w-[48%] md:w-[35%] p-1 rounded-xl border mx-auto bg-slate-800">
            <div className="flex justify-between px-1">
                <Link href={`/profile/${blog.author.username}`} className="flex w-full">
                    <img
                        alt = "Profile" 
                        src={blog.author.profileImage || "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.jpg?b=1&s=612x612&w=0&k=20&c=XApNjZNyiu4Oc-xGxtRLOsxIvtsZtL3jZRTOxv4G-NM="}
                        className=" w-9 h-9 rounded-full" />
                    <p className="w-[80%] py-2 px-2 text-sm font-bold">{blog.author.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => {
                            onLike()
                        }
                        }
                        className="transition duration-200 ease-in-out"
                    >
                        <Heart
                            className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                    </button>
                    <p>{likesCount}</p>
                </div>
            </div>
            <div className=" my-1 rounded-xl bg-slate-700 p-2 flex flex-col">
                <p className="font-semibold">{blog.title}</p>
                <div>
                    {blog.tags.map((tag, index) => (<span key={index}
                        className="text-sm text-white/50 font-thin"
                    >#{tag}</span>))}
                </div>
                <p className="text-sm text-white/80">
                    {expanded || !isLong ? blog.content : `${blog.content.slice(0, limit)}...`}
                    <button onClick={toggleExpand}
                        className="text-blue-400 hover:underline ml-1"
                    >
                        {expanded ? "See less" : "See more"}
                    </button>
                </p>
            </div>
        </div>
    )
}