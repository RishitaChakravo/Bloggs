"use client"

import axios from "axios";
import { useState } from "react"
import { NavBar } from "../components/navbar/page";

export default function WriteUp(){
    type UserData = {
        title: string,
        content: string;
        tags: string[];
    }
    const [userData, setUserData] = useState<UserData>({
        title: "",
        content: "",
        tags: []
    })

    async function blogSubmit() {
        try {
            const response = await axios.post("/api/users/blog", userData)
            console.log("Blog saved successfully", response)
        } catch (error) {
            console.error("Failed to save the blog")
        }
    }
    return(
        <div className="h-full w-full">
            <div className="text-center mx-auto my-5 rounded-full w-1/2 h-auto top-0 z-50 bg-black border border-white/30">
                <p className="text-2xl text-blue-600 font-mono font-bold">bloggs</p>
            </div>
            <div className="flex flex-col justify-center items-center h-screen">
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
                    className="mx-auto w-[100px] border border-cyan-600 px-3 rounded-md">tech</button>
                    <button 
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("work")
                            ? prev.tags.filter((tag) => tag !== "work")
                            : [...prev.tags, "work"],
                        }))
                        } 
                    className="mx-auto w-[100px] border border-cyan-600 px-3 rounded-md">work</button>
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
                    className="mx-auto w-[100px] border border-cyan-600 px-3 rounded-md">art</button>
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
                    className="mx-auto w-[100px] border border-cyan-600 px-3 rounded-md">home</button>
                    <button 
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("finance")
                            ? prev.tags.filter((tag) => tag !== "finance")
                            : [...prev.tags, "finance"],
                        }))
                        } 
                    className="mx-auto w-[100px] border border-cyan-600 px-3 rounded-md">finance</button>
                    <button
                    onClick={() =>
                        setUserData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes("adventure")
                            ? prev.tags.filter((tag) => tag !== "adventure")
                            : [...prev.tags, "adventure"],
                        }))
                        } 
                    className="mx-auto w-[100px] border border-cyan-600 px-3 rounded-md">adventure</button>
                </div>
                <input placeholder="Title" value={userData.title} type="text" className="w-[500px] rounded-lg my-2 px-2 text-3xl text-gray-900 font-bold"/>
                <textarea placeholder="Content" className="font-thin text-lg mt-3 w-[500px] h-[500px] rounded-lg border hover:border-2 hover:border-blue-600 transition-all duration-200 ease-in-out
                p-4
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