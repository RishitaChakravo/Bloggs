'use client'

import { Heart, MessageCircle } from "lucide-react";
import { Blog, User } from "../search/page";
import { useState } from "react";
import axios from "axios";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});


export interface Comment {
    content: string;
    author: User;
    createdAt: Date
}

export default function BlogCard2({ blog }: { blog: Blog }) {
    const [onComment, setOnComment] = useState(false)
    const [liked, setLiked] = useState(blog.hasLiked)
    const [likeCount, setLikeCount] = useState(blog.likes)
    const [commentContent, setCommentContent] = useState("")

    const onLike = async () => {
        try {
            if (!liked) {
                const response = await axios.post('/api/users/Likes/like', { blogId: blog._id })
                console.log(response.data.message)
                setLiked(true)
                setLikeCount(prev => prev + 1)
            } else {
                const response = await axios.post('/api/users/Likes/dislike', { blogId: blog._id })
                console.log(response.data.message)
                setLiked(false)
                setLikeCount(prev => prev - 1)
            }
        } catch (error: any) {
            console.log("Like/Unlike process failed", error.message)
        }
    }

    const comment = async () => {
        try {
            if (commentContent.trim() !== "") {
                const response = await axios.post('api/users/comments', { content: commentContent, blogId: blog._id })
                console.log("Comment successfully created")
                console.log(response.data.message)
            } else {
                console.log("write a comment")
            }
        } catch (error: any) {
            console.error(error.message)
        } finally {
            setCommentContent("")
        }
    }

    return (
        <div className="flex h-[500px] w-[500px] z-50 border rounded-2xl">
            <div className={`relative p-5 h-full w-full bg-gradient-to-t from-slate-800 to-slate-900 rounded-l-2xl ${onComment ? 'overflow-clip' : 'overflow-auto'}`}>
                <div className="mb-2 flex items-center gap-3">
                    <img src={blog.author.profileImage} className="h-12 w-12 rounded-full"></img>
                    <div>
                        <p className={`${playfair.className}`}>{blog.author.name}</p>
                        <p className="text-white/50 text-sm">@{blog.author.username}</p>
                    </div>
                </div>
                <hr className="w-full my-3"></hr>
                <div className={`text-3xl font-extralight leading-tight ${playfair.className}`}>{blog.title}</div>
                <div className="mt-5">{blog.content}</div>
                <div className="mt-3 text-white/50">{blog.tags.map((tag, idx) => (<span key={idx}>#{tag}</span>))}</div>
                {onComment &&
                    <div className="absolute inset-0 left-0 w-full h-full p-4 bg-neutral-800 rounded-2xl text-white">
                        {blog.commentDocs.length > 0 ?
                            (<div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {blog.commentDocs.map((comment, idx) => (
                                    <div key={idx} className="p-2 bg-neutral-700 rounded flex items-center gap-3">
                                        <img src={comment.author.profileImage} className="h-12 w-12 rounded-full"></img>
                                        <div>
                                            <p className="text-sm text-white/80">{comment.content}</p>
                                            <p className="text-xs text-white/40">— {comment.author.username}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="absolute bg-neutral-900 bottom-0 left-0 w-full flex items-center gap-2 px-3 rounded-bl-xl h-12">
                                    <input
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="px-3 bg-transparent w-full h-full"></input>
                                    <button
                                        onClick={() => comment()}
                                        className="h-8 w-8 rounded-full bg-blue-600">⮝</button>
                                </div>
                            </div>) :
                            <div className="h-full w-full flex flex-col justify-center items-center">
                                <p className="text-center text-2xl">No comments yet</p>
                                <p className="text-white/50 text-sm">Start the conversation</p>
                                <div className="absolute bg-neutral-900 bottom-0 left-0 w-full flex items-center gap-2 px-3 rounded-bl-xl h-12">
                                    <input
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="px-3 bg-transparent w-full h-full"></input>
                                    <button
                                        onClick={() => comment()}
                                        className="h-8 w-8 rounded-full bg-blue-600">⮝</button>
                                </div>
                            </div>}
                    </div>}
            </div>
            <div className="h-full w-[10%] flex flex-col gap-2 justify-end items-center py-5">
                <div>
                    <button
                        onClick={() => onLike()}
                        className="transition duration-200 ease-in-out"
                    >
                        <Heart
                            className={`w-8 h-8 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                    </button>
                    <p className="text-center">{likeCount}</p>
                </div>
                <div>
                    <button
                        onClick={() => setOnComment(!onComment)}>
                        <MessageCircle className="w-8 h-8" />
                    </button>
                    <p className="text-center">{blog.commentCount}</p>
                </div>
            </div>
        </div>
    )
}