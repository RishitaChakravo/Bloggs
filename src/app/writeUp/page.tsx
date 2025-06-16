"use client"

import axios from "axios";
import { useState } from "react"

export default function WriteUp(){
    type UserData = {
        content: string;
        tags: string[];
    }
    const [userData, setUserData] = useState<UserData>({
        content: "",
        tags: []
    })

    async function blogSubmit() {
        try {
            const response = await axios.post("/api/users/blog", userData)
        } catch (error) {
            
        }
    }
    return(
        <div className="h-full w-full">
            <div className="flex flex-col items-center mt-32">
                <div className="grid grid-cols-3 w-[500px]">
                    <button 
                    value="tech"
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("tech")
                            ? prev.tags.filter((tag) => tag !== "tech")
                            : [...prev.tags, "tech"],
                        }))
                        } 
                    className="w-[100px] border border-cyan-600 px-3 rounded-md">tech</button>
                    <button 
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("work")
                            ? prev.tags.filter((tag) => tag !== "work")
                            : [...prev.tags, "work"],
                        }))
                        } 
                    className="w-[100px] border border-cyan-600 px-3 rounded-md">work</button>
                    <button 
                    value="art"
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("art")
                            ? prev.tags.filter((tag) => tag !== "art")
                            : [...prev.tags, "art"],
                        }))
                        } 
                    className="w-[100px] border border-cyan-600 px-3 rounded-md">art</button>
                    <button 
                    value="home"
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("home")
                            ? prev.tags.filter((tag) => tag !== "home")
                            : [...prev.tags, "home"],
                        }))
                        } 
                    className="w-[100px] border border-cyan-600 px-3 rounded-md">home</button>
                    <button 
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("finance")
                            ? prev.tags.filter((tag) => tag !== "finance")
                            : [...prev.tags, "finance"],
                        }))
                        } 
                    className="w-[100px] border border-cyan-600 px-3 rounded-md">finance</button>
                    <button
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("adventure")
                            ? prev.tags.filter((tag) => tag !== "adventure")
                            : [...prev.tags, "adventure"],
                        }))
                        } 
                    className="w-[100px] border border-cyan-600 px-3 rounded-md">adventure</button>
                </div>
                <textarea className="mt-3 w-[500px] h-[300px] rounded-lg border hover:border-2 hover:border-blue-600 transition-all duration-200 ease-in-out
                p-4 text-base
                text-gray-700
                hover:shadow-md focus:shadow-lg
                bg-white placeholder-gray-400
                focus:ring-4 focus:ring-blue-400 focus:ring-opacity-100
                " value={userData.content} onChange={(e) => setUserData({...userData, content: e.target.value})}></textarea>
                
                <button className="mt-2" onClick={blogSubmit}>Submit</button>
            </div>
        </div>
    )
}