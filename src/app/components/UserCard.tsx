import axios from "axios";

interface User {
    name: string;
    username: string;
    profileImage: string;
    followers: number;
} 

interface Props {
    user: User;
}
export default function UserCard({user}: Props){
    const followButton = async () => {
        try {
            const response = await axios.get('/api/users/follow')
        } catch (error: any) {
            
        }
    }
    return(
        <div className="flex justify-between items-center w-4/5 md:w-2/5 h-auto px-7 py-2 rounded-xl border my-2 mx-auto bg-slate-800">
            <img src='https://images.pexels.com/photos/31098335/pexels-photo-31098335.jpeg'
            className="w-14 h-14 rounded-full"></img>
            {/* src={user.profileImage}
            alt={user.name} */}
            <div>
                <p className="text-base font-bold">{user.name}</p>
                <p className="text-sm font-thin">@{user.username}</p>
                <p className="text-sm font-thin">{user.followers}</p>
            </div>
            <button
            onClick={followButton} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                Follow
            </button>
        </div>
    )
}