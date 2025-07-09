"use client"

import axios from "axios";
import { useState } from "react"

export default function WriteUp() {
    type UserData = {
        title: string,
        content: string;
        tags: string[];
    }
    const [Tags, setTags] = useState<string[]>([])
    const [tagPrompt, setTagPrompt] = useState<string>("")
    const [userData, setUserData] = useState<UserData>({
        title: "",
        content: "",
        tags: []
    })

    async function blogSubmit() {
        try {
            setUserData({ ...userData, tags: Tags })
            const response = await axios.post("/api/users/blog", userData)
            console.log("Blog saved successfully", response)
        } catch (error) {
            console.error("Failed to save the blog")
        } finally {
            setTags([])
            setUserData({
                title: "",
                content: "",
                tags: []
            })
        }
    }

    const removeTag = () => {
        setTags(prevTags => prevTags.slice(0, -1))
    }

    return (
        <div className="h-full w-full">
            <div className="text-center mx-auto my-5 rounded-full w-1/2 h-auto top-0 z-50 bg-black border border-white/30">
                <p className="text-2xl text-blue-600 font-mono font-bold">bloggs</p>
            </div>
            <div className="mx-auto my-10 w-[500px] flex flex-col justify-center items-center">
                <div className="flex w-full justify-center items-center">
                    <ul className="flex w-full mx-2 rounded-lg h-8 bg-neutral-700 px-2 text-white font-mono">
                        {Tags.map((Tag, index) => (
                            <li key={index}>{Tag}|</li>
                        ))}
                    </ul>
                </div>
                <label htmlFor="tagInput" className="sr-only">Enter a tag</label>
                <input 
                id="tagInput"
                className="px-2 h-8 rounded-lg my-2 text-neutral-800"
                placeholder="Tags"
                type="text" 
                value={tagPrompt} 
                onChange={(e) => setTagPrompt(e.target.value)}
                />
                <div className="flex justify-center gap-2 my-2 w-full">
                    <button
                        className="w-10 h-10 text-2xl transition ease-out border py-1 rounded-full font-bold hover:bg-blue-500 hover:border-blue-500"
                        onClick={() => {
                            setTags([...Tags, tagPrompt])
                            setTagPrompt("")
                        }}>+
                    </button>
                    <button
                        disabled={Tags.length === 0}
                        onClick={removeTag}
                        className={`w-10 h-10 rounded-full font-bold text-xl bg-red-600 focus:bg-black`}>x</button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center h-screen">
                <input placeholder="Title" value={userData.title} onChange={(e) => setUserData({ ...userData, title: e.target.value })} type="text" className="w-[500px] rounded-lg my-2 px-2 text-3xl text-gray-900 font-bold" />
                <textarea placeholder="Content" className="font-thin text-lg mt-3 w-[500px] h-[500px] rounded-lg border hover:border-2 hover:border-blue-600 transition-all duration-200 ease-in-out
                p-4
                text-gray-700
                hover:shadow-md focus:shadow-lg
                bg-white placeholder-gray-400
                focus:ring-4 focus:ring-blue-400 focus:ring-opacity-100
                " value={userData.content} onChange={(e) => setUserData({ ...userData, content: e.target.value })}></textarea>

                <button className="bg-white text-black hover:bg-gray-300 py-1 px-10 rounded-lg mt-2" onClick={blogSubmit}>SUBMIT</button>
            </div>
        </div>
    )
}