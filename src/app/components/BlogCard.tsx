'use client'

import {User} from "@/app/search/page"
import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface Blog {
    _id: string;
    content: string;
    title: string;
    author: User;
    tags: [string];
}

interface Props {
    blog: Blog
}
export default function BlogCard({blog}: Props) {
    const [liked, setLiked] = useState(false)

    const onLike = async () => {
        try {
            const info = liked ? 'like' : 'unlike'
            const response = await axios.post('/api/users/blogLikes', {blogId: blog._id, info})
        } catch (error: any) {
            console.log("Something went seriouslt wrong")
        }
    }
    return(
        <div className="h-auto w-[48%] md:w-[35%] p-1 rounded-xl border mx-auto bg-slate-800">
            <Link href={`/profile/${blog.author.username}`}>
                <div className="flex justify-between px-1">
                        <img src={blog.author.profileImage || "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.jpg?b=1&s=612x612&w=0&k=20&c=XApNjZNyiu4Oc-xGxtRLOsxIvtsZtL3jZRTOxv4G-NM="}
                        className=" w-9 h-9 rounded-full" />
                        <p className="flex items-center w-[80%] py-2 text-sm font-bold">{blog.author.name}</p>

                    <button 
                        onClick={() => {
                            onLike()
                            setLiked(!liked)}
                        }
                        className="transition duration-200 ease-in-out"
                    >
                        <Heart
                            className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500': 'text-gray-400'}`}    
                        />
                    </button>
                </div>
            </Link>
            <div className=" my-1 rounded-xl bg-slate-700 p-2 flex flex-col">
                <p className="font-semibold">{blog.title}</p>
                <div>
                    {blog.tags.map((tag, index) => (<span key={index}
                    className="text-sm text-white/50 font-thin"
                    >#{tag}</span>))}
                </div>
                <p className="text-sm text-white/80">{blog.content}</p>
            </div>
        </div>
    )
}