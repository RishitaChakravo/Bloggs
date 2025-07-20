import axios from "axios";
import Link from "next/link";
import { useState } from "react";

interface User {
    _id: string;
    name: string;
    username: string;
    profileImage: string;
    followers: number;
}

interface Props {
    user: User;
}
export default function UserCard({ user }: Props) {
    const [follow, setFollow] = useState(false)
    const followButton = async () => {
        try {
            const response = await axios.post('/api/users/follow', {followingId: user._id})
            console.log("Follow request sent successfully", response.data);
        } catch (error: any) {
            console.log(error.message)
        }
    }
    return (
        <div className="flex justify-between items-center w-4/5 md:w-2/5 h-auto px-7 py-2 rounded-xl my-2 mx-auto bg-slate-800">
            <Link href={`/profile/${user.username}`} >
                <img src={user.profileImage}
                    className="w-14 h-14 rounded-full"></img>
                {/* src={user.profileImage}
                    alt={user.name} */}
            </Link>
            <Link href={`/profile/${user.username}`} >
                <div>
                    <p className="text-base font-bold">{user.name}</p>
                    <p className="text-sm font-thin">@{user.username}</p>
                    <p className="text-sm font-thin">{user.followers}</p>
                </div>
            </Link>
            <button
                onClick={() => {
                    followButton()
                    setFollow(!follow)
                }}
                className={`text-white font-semibold py-2 px-4 rounded-full ${follow ? 'border' : 'bg-blue-500 hover:bg-blue-600'}`}>
                {follow ? 'Unfollow' : 'Follow'}
            </button>
        </div>
    )
}