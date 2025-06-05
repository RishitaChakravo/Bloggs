import Link from "next/link";

export function NavBar() {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black shadow-lg px-10 py-3 
        text-center sm:flex items-center justify-between rounded-full w-[50%] max-w-5xl sm:w-[80%]">
            <div>
                <p className="text-2xl text-blue-600 font-mono font-bold">bloggs</p>
            </div>
            <div className="space-x-2 hidden sm:block">
                <Link href="/">
                    <button className="hover:text-gray-400">Home</button>
                </Link>
                <Link href="/about-us">
                    <button className="hover:text-gray-400">About Us</button>
                </Link>
                <Link href="/contact-us">
                    <button className="hover:text-gray-400">Contact Us</button>
                </Link>
            </div>
            <div>
                <Link href="/signup">
                    <button className="text-blue-600 hidden sm:block border border-blue-600 px-4 py-1 rounded-full hover:bg-blue-600 hover:text-white transition">Sign Up</button>
                </Link>
            </div>
        </div>
    );
}
