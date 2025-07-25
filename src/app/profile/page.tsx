"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import BlogCard from "../components/BlogCard";
import { Comment } from "../components/BlogCard2";

export interface Blog {
  _id: string;
  content: string;
  title: string;
  author: BlogUser;
  tags: string[];
  hasLiked: boolean;
  likes: number;
  commentDocs: Comment[];
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

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>({
    name: "Unknown",
    username: "Unknown",
    followers: 0,
    following: 0,
    coverImage: "",
    profileImage: "",
  });
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/profile", {
          withCredentials: true,
        });
        setUser(response.data.data);
        toast.success("Profile fetched");
      } catch (error: any) {
        toast.error("Failed to fetch Profile");
      } finally {
        setLoading(false);
      }
    };

    const getBlogDisplay = async () => {
      try {
        const response = await axios.get("/api/users/blogDisplay");
        setBlogs(response.data.blogs);
        toast.success(response.data.message || "Blogs fetched");
      } catch (error: any) {
        toast.error("Failed to fetch blogs");
      }
    };

    getProfile();
    getBlogDisplay();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-light text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg bg-slate-800 relative">
        {/* Cover Image */}
        <div
          className="h-60 bg-cover bg-center"
          style={{
            backgroundImage: `url(${user.coverImage || "https://images.pexels.com/photos/32356082/pexels-photo-32356082.jpeg"})`,
          }}
        />

        {/* Profile Image */}
        <div className="absolute top-40 left-6 z-10">
          <img
            src={user.profileImage || "https://images.pexels.com/photos/32356082/pexels-photo-32356082.jpeg"}
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-slate-900 object-cover shadow-md"
          />
        </div>

        {/* Profile Info */}
        <div className="p-6 pt-24">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-xl text-gray-300">@{user.username}</p>
              <div className="mt-4 text-center mx-auto flex gap-6">
                <div>
                  <p className="font-bold text-xl">{user.followers > 0 ? user.followers : '0'}</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-xl">{user.following > 0 ? user.following : '0'}</p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>
            </div>
            <Link href="/writeUp">
              <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-semibold text-white">
                + New Blog
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      {Array.isArray(blogs) && blogs.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-2xl text-gray-500 font-light">You haven't written any blogs yet.</p>
          <Link href="/writeUp">
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
              Start Writing
            </button>
          </Link>
        </div>
      ) : (
        <div className="mx-auto mt-10 flex flex-wrap justify-center max-w-screen sm:max-w-3xl gap-6">
          {blogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

