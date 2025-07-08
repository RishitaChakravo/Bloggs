import axios from "axios";
import Link from "next/link";

interface NavProp {
    isLoggedIn: boolean;
}

export function NavBar({isLoggedIn} : NavProp) {
    const logout = async() => {
        try {
            const response = await axios.post('/api/users/logout')
            console.log(response.data.message)
        } catch (error:any) {
            console.log(error.message)
        }
    }
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black shadow-lg px-10 py-3 
        text-center sm:flex items-center justify-between rounded-full w-[50%] max-w-5xl sm:w-[80%]">
            <div>
                <p className="text-2xl text-blue-600 font-mono font-bold">bloggs</p>
            </div>
            <div className="space-x-3 hidden sm:block">
                <Link href="/">
                    <button>
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" alt="Home" width="20" height="20"/>
                    </button>
                </Link>
                <Link href="/search">
                    <button>
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/search--v1.png" alt="Search" width="20" height="20"></img>
                    </button>
                </Link>
            </div>
            <div>
                {isLoggedIn ? 
                <button onClick={logout}
                className="text-white-600 hidden sm:block border px-4 py-1 rounded-full hover:bg-red-600 hover:border-red-600 hover:text-white transition"
                >
                    LOGOUT
                </button> : 
                <Link href="/signup">
                    <button className="text-blue-600 hidden sm:block border border-blue-600 px-4 py-1 rounded-full hover:bg-blue-600 hover:text-white transition">Sign Up</button>
                </Link>}
            </div>
        </div>
    );
}
