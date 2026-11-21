"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogCard from "@/app/components/BlogCard";
import { Comment } from "@/app/components/BlogCard2";
import toast from "react-hot-toast";

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
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [followCount, setFollowCount] = useState(0);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/otherProfile?username=${username}`, {
          withCredentials: true,
        });
        setUser(res.data.data);
        setHasFollowed(res.data.data.hasFollowed);
        setFollowCount(res.data.data.followers);
      } catch (error) {
        console.error("Failed to fetch user", error instanceof Error ? error.message : error);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`/api/users/blogDisplay?username=${username}`);
        setBlogs(res.data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs", error instanceof Error ? error.message : error);
      }
    };

    fetchProfile();
    fetchBlogs();
  }, [username]);

  const toggleFollow = async () => {
    try {
      await axios.post("/api/users/follow", { followingId: user?._id });
      if (hasFollowed) {
        setFollowCount((prev) => prev - 1);
        toast.success(`You unfollowed ${user?.name}`);
      } else {
        setFollowCount((prev) => prev + 1);
        toast.success(`You followed ${user?.name}`);
      }
      setHasFollowed(!hasFollowed);
    } catch (error) {
      toast.error("Failed to follow/unfollow", error instanceof Error ? error.message : error);
    }
  };

  if (!user)
    return (
      <div className="h-screen w-full flex justify-center items-center text-white text-lg">
        Loading profile...
      </div>
    );

  return (
    <div className="p-4 bg-neutral-900 min-h-screen text-white">
      {/* Profile Card */}
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
                  <p className="font-bold text-xl">{followCount}</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-xl">{user.following}</p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>
            </div>

            <button
              onClick={toggleFollow}
              className={`${
                hasFollowed
                  ? "border border-white hover:bg-blue-700 hover:border-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors px-4 py-2 rounded-lg font-semibold text-white`}
            >
              {hasFollowed ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      {Array.isArray(blogs) && blogs.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-2xl text-gray-500 font-light">
            This user hasn’t written any blogs yet.
          </p>
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


