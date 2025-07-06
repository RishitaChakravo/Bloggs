"use client";
 
import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import axios from "axios";

interface Blog {
    content: string;
    title: string;
    authorName: string;
}

export function InfiniteCards() {
    const [blogs, setBlogs] = useState<Blog[]>([])

    useEffect(() => {
        const popularBlogs = async () => {
            try {
                const response = await axios.get('/api/users/popularBlogs')
                setBlogs(response.data.blogs)
            } catch (error: any) {
                console.error(error)
            }
        }

        // popularBlogs()
    }, [])

    return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={blogs}
        direction="right"
        speed="slow"
      />
    </div>
  );
}