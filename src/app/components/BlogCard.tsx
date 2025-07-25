'use client'

import { BlogUser } from "../search/page";
import { useState } from "react";
import { ArrowLeft, Delete, DeleteIcon, Edit, Heart, Trash } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { Comment } from "./BlogCard2";
import toast from "react-hot-toast";

interface Blog {
    _id: string;
    content: string;
    title: string;
    author: BlogUser;
    tags: string[];
    hasLiked: boolean;
    likes: number;
    commentDocs: Comment[]
}

interface Props {
    blog: Blog,
    showButton?: boolean;
}

export default function BlogCard({ blog, showButton = true }: Props) {
    const limit = 100
    const isLong = blog.content.length > 100
    const [expanded, setExpanded] = useState(false)
    const [liked, setLiked] = useState(blog.hasLiked)
    const [likesCount, setLikesCount] = useState(blog.likes ?? 0)
    const [editBlock, setEditBlock] = useState(false)
    const [title, setTitle] = useState(blog.title)
    const [content, setContent] = useState(blog.content)

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

    const editBlog = async () => {
        try {
            const response = await axios.post('/api/users/editBlog', { blogId: blog._id, title, content})
            if (response.data.success) {
                toast.success("Edited Blog")
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    const deleteBlog = async () => {
        try {
            const response = await axios.post('/api/users/deleteBlog', { blogId: blog._id })
            if (response.data.success) {
                toast.success("Blog deleted successfully")
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }
    return (
        <div className="flex-1 min-w-[250px] max-w-[300px] p-1 rounded-xl border bg-slate-800">
            {editBlock && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

                    <div className="relative w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl p-6 space-y-5 animate-fadeIn border border-zinc-700">
                        <button
                            onClick={() => setEditBlock(false)}
                            className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="text-xl font-semibold text-white text-center">Edit Blog</h2>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg px-4 py-2 border border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new title"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-32 rounded-lg px-4 py-2 border border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Update your content..."
                        />
                        <div className="flex justify-center">
                            <button
                                onClick={editBlog}
                                className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between px-1">
                <Link href={`/profile/${blog.author.username}`} className="flex w-full">
                    <img
                        alt="Profile"
                        src={blog.author.profileImage || "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.jpg?b=1&s=612x612&w=0&k=20&c=XApNjZNyiu4Oc-xGxtRLOsxIvtsZtL3jZRTOxv4G-NM="}
                        className=" w-9 h-9 rounded-full" />
                    <p className="w-[80%] py-2 px-2 text-sm font-bold">{blog.author.name}</p>
                </Link>
                {
                    showButton &&
                    <div className="flex gap-2 mx-1">
                        <button
                            onClick={() => setEditBlock(!editBlock)}
                            className="transition duration-200 ease-in-out">
                            <Edit className={`w-5 h-5 text-gray-300`}></Edit>
                        </button>
                        <button
                            onClick={deleteBlog}
                            className="transition duration-200 ease-in-out">
                            <Trash className={`w-5 h-5 text-gray-300`}></Trash>
                        </button>
                    </div>
                }
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
                <div className="h-auto flex flex-wrap">
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