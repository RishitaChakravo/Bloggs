"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { NavBar } from "../components/navbar/page";

export default function WriteUp() {
    const router = useRouter();

    type UserData = {
        title: string,
        content: string;
        tags: string[];
    };

    const [Tags, setTags] = useState<string[]>([]);
    const [tagPrompt, setTagPrompt] = useState<string>("");
    const [userData, setUserData] = useState<UserData>({
        title: "",
        content: "",
        tags: []
    });

    async function blogSubmit() {
        try {
            const finalData: UserData = {
                ...userData,
                tags: Tags
            };
            const response = await axios.post("/api/users/blog", finalData);
            console.log("Blog saved successfully", response);
        } catch (error) {
            console.error("Failed to save the blog", error);
        } finally {
            setTags([]);
            setUserData({
                title: "",
                content: "",
                tags: []
            });
            router.push('/');
        }
    }

    const removeTag = () => {
        setTags(prevTags => prevTags.slice(0, -1));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <NavBar showButton={false}/>
            <div className="flex flex-col items-center justify-center py-10 px-4 pt-32">
                <div className="w-full max-w-2xl bg-white text-black rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Write a Blog</h1>

                    {/* Tag List */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {Tags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Tag Input */}
                    <div className="flex gap-2 mb-6">
                        <input
                            id="tagInput"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a tag"
                            type="text"
                            value={tagPrompt}
                            onChange={(e) => setTagPrompt(e.target.value)}
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            onClick={() => {
                                if (tagPrompt.trim() !== "") {
                                    setTags([...Tags, tagPrompt.trim()]);
                                    setTagPrompt("");
                                }
                            }}
                        >
                            Add
                        </button>
                        <button
                            disabled={Tags.length === 0}
                            onClick={removeTag}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Remove Last
                        </button>
                    </div>

                    {/* Title Input */}
                    <input
                        placeholder="Blog Title"
                        value={userData.title}
                        onChange={(e) => setUserData({ ...userData, title: e.target.value })}
                        type="text"
                        className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Content Textarea */}
                    <textarea
                        placeholder="Write your blog content here..."
                        value={userData.content}
                        onChange={(e) => setUserData({ ...userData, content: e.target.value })}
                        className="w-full h-60 px-4 py-3 rounded-md border border-gray-300 resize-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md font-semibold transition"
                            onClick={blogSubmit}
                        >
                            Submit Blog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
