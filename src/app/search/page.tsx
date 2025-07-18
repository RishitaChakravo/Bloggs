"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import UserCard from "../components/UserCard"
import BlogCard from "../components/BlogCard";
import { Comment } from "../components/BlogCard2";

export interface User {
    name: string;
    username: string;
    profileImage: string;
    followers: number;
}

export interface BlogUser {
    name: string;
    username: string;
    profileImage: string;
}

export interface Blog {
    _id: string;
    content: string;
    title: string;
    author: BlogUser;
    tags: string[];
    hasLiked: boolean;
    likes: number;
    commentDocs: Comment[];
    commentCount: number;
}

export default function Search() {
    const [prompt, setprompt] = useState("")
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(!prompt.trim()) {
            setBlogs([])
            setUsers([])
            return;
        }
        
        const searchResults = async () => {
            try {
                setLoading(true)
                const response = await axios.get('/api/users/searchBar', {
                    params: { query: prompt }
                })
                setBlogs(response.data.blogs)
                setUsers(response.data.users)
                console.log("Fetched search results", response.data.blogs, response.data.users)
            } catch (error: any) {
                console.error("Search failed", error)
            } finally {
                setLoading(false)
            }
        }

        searchResults()
    }, [prompt])
    return (
        <div className="p-2 flex flex-col justify-center items-center">
            <div className="w-3/5 mx-auto p-2 h-auto mb-5">
                <input
                    value={prompt}
                    placeholder="Search: Your fav authors or write ups"
                    onChange={(e) => setprompt(e.target.value)}
                    className="block mx-auto w-4/5 h-8 bg-white rounded-full px-4 
                text-black border border-gray-300 
                hover:border-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                transition-all duration-200 shadow-sm focus:shadow-md"/>
            </div>
            <div className="bg-gray-900 w-4/5 h-[570px] overflow-y-auto rounded-xl" >
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className=" my-10 border-4 border-t-transparent w-6 h-6 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div>
                        <div>
                            <ul>
                                {users.map((user, index) => (<li key={index}>
                                    <UserCard user={{
                                        name: user.name || "Unknown",
                                        username: user.username || "anonymous",
                                        profileImage: user.profileImage || "/default-profile.png",
                                        followers: user.followers || 0
                                    }} />
                                </li>))}
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-4 w-[90%] mx-auto p-2">
                            {blogs.map((blog, index) => (
                                <BlogCard
                                key={index}
                                blog={blog}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}