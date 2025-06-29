"use client"

import axios from "axios"
import { useEffect, useState } from "react"

export default function Search(){
    const [prompt, setprompt] = useState("")
    const [blogs, setBlogs] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const searchResults = async () => {
            try {
                const response = await axios.get('/api/users/searchBar', {
                    params: { query: prompt }
                })
                setBlogs(response.data.blogs)
                setUsers(response.data.users)
                console.log("Fetched search results", response.data.blogs, response.data.users)
            } catch (error: any) {
                console.error("Search failed", error)
            }
        }

        // searchResults()
    }, [prompt])
    return(
        <div className="p-2">
            <div className="w-3/5 mx-auto p-2 h-auto">
                <input 
                value = {prompt}
                onChange={(e) => setprompt(e.target.value)}
                className="block mx-auto w-4/5 h-8 bg-white rounded-full px-4 
                text-black border border-gray-300 
                hover:border-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                transition-all duration-200 shadow-sm focus:shadow-md"/>
            </div>
            <div className="bg-gray-900 w-4/5 h-auto rounded-xl" >
                <div>
                    <ul>
                        {blogs.map((blog, index) => (<li key={index}>
                                
                        </li>))}
                    </ul>
                </div>
                <div></div>
            </div>
        </div>
    )
}