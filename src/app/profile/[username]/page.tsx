"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import BlogCard from "@/app/components/BlogCard"
import { Comment } from "@/app/components/BlogCard2"
import toast from "react-hot-toast"

export interface Blog {
  _id: string;
  content: string;
  title: string;
  author: BlogUser;
  tags: string[];
  hasLiked: boolean;
  likes: number;
  commentDocs: Comment[]
}

export interface BlogUser {
  name: string;
  username: string;
  profileImage: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  followers: number;
  following: number;
  coverImage: string;
  profileImage: string;
  hasFollowed: boolean;
}

export default function PublicProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [hasfollowed, setHasfollowed] = useState<boolean>(false)
  const [followCount, setFollowCount] = useState<number>(0)

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/otherProfile?username=${username}`, {
          withCredentials: true,
        })
        setUser(res.data.data)
        setHasfollowed(res.data.data.hasFollowed)
        setFollowCount(res.data.data.followers)
        console.log(res.data.data)
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

  if (!user) return <p className="text-center mt-10 text-lg text-white/60">Loading profile...</p>

  const follow = async () => {
    try {
      const response = await axios.post('/api/users/follow', { followingId: user._id })

      if(hasfollowed) {
        setFollowCount(prev => prev - 1)
        toast.success(`You unfollowed ${user.name}`)
      } else {
        setFollowCount(prev => prev + 1)
        toast.success(`You followed ${user.name}`)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not follow user")
    }
  }

  return (
    <div className="p-4 bg-neutral-900 min-h-screen text-white">
      <div className="mx-auto max-w-3xl border rounded-xl bg-slate-800 shadow-md overflow-hidden">
        <div
          className="w-full h-[250px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${user.coverImage || 'https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg'})`,
          }}
        />
        <div className="relative px-6 pb-6 pt-4">
          <img
            src={user.profileImage || "https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg"}
            alt="Profile"
            className="w-[120px] h-[120px] border-4 border-white rounded-full absolute -top-[60px] left-6 object-cover"
          />
          <div className="ml-[140px]">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-white/60">@{user.username}</p>
            <div className="flex items-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-lg font-semibold">{followCount || 0}</p>
                <p className="text-sm text-white/50">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{user.following > 0 ? user.following : '0'}</p>
                <p className="text-sm text-white/50">Following</p>
              </div>
              {hasfollowed ? (
                <button
                  onClick={follow}
                  className="ml-auto px-4 py-1.5 bg-transparent border hover:bg-blue-700 hover:border-blue-700 transition rounded-md text-sm font-medium"
                >
                  UnFollow
                </button>) : (
                <button
                  onClick={follow}
                  className="ml-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-700 transition rounded-md text-sm font-medium"
                >
                  Follow
                </button>)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6">
        {blogs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-white/40">This user hasn't written any blogs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

