"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import BlogCard from "@/app/components/BlogCard"

export interface Blog {
  _id: string;
  content: string;
  title: string;
  author: BlogUser;
  tags: [string]
}

export interface BlogUser {
  name: string;
  username: string;
  profileImage: string;
}

interface User {
  name: string;
  username: string;
  followers: number;
  following: number;
  coverImage: string;
  profileImage: string;
}

export default function PublicProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/otherProfile?username=${username}`, {
          withCredentials: true,
        })
        setUser(res.data.data)
      } catch (err) {
        console.error("Failed to fetch user", err)
      }
    }

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`/api/users/blogDisplay?username=${username}`)
        setBlogs(res.data.blogs)
      } catch (err) {
        console.error("Failed to fetch blogs", err)
      }
    }

    fetchProfile()
    fetchBlogs()
  }, [username])

  if (!user) return <p className="text-center mt-10">Loading profile...</p>

  return (
    <div className="p-2">
      <div className="mx-auto relative h-screen w-3/5 border border-white/0 rounded-xl bg-slate-800">
        <div
          className="w-full h-[300px] bg-cover bg-center border border-white/0 rounded-t-xl"
          style={{
            backgroundImage: `url(${user.coverImage || 'https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg'})`,
          }}
        />
        <img
          src={user.profileImage || "https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg"}
          className="m-0 w-[180px] h-[180px] border rounded-full relative top-[-50px] left-[30px]"
        />
        <div className="px-3 pb-4 w-full flex flex-col justify-center gap-3">
          <p className="text-3xl font-bold">{user.name}</p>
          <p className="text-xl font-bold">@{user.username}</p>
          <div className="w-full flex justify-evenly">
            <div>
              <p>{user.followers}</p>
              <p>followers</p>
            </div>
            <div>
              <p>{user.following}</p>
              <p>following</p>
            </div>
          </div>
          <button className="border rounded-md cursor-pointer">Follow</button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center mt-2">
          <p className="text-2xl font-sans font-extralight text-white/25">
            This user hasn't written any blogs yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap mt-3 border w-3/5 mx-auto h-auto rounded-xl p-3">
          {blogs.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
            />
          ))}
        </div>
      )}
    </div>
  )
}
