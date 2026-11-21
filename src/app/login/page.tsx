"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
    const router = useRouter();
    const [disabled, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const onLogin = async () => {
        if (!disabled) {
            setLoading(true);
        }
        try {
            const response = await axios.post("/api/users/login", userData, {
                withCredentials: true,
            });
            setMessage(response.data.message);
            setSuccess(response.data.success);
            toast.success("Logged in successfully");
        } catch (error) {
            console.error(error instanceof Error ? error.message : error)
            toast.error("Login failed");
            setSuccess(false);
            setMessage("Invalid credentials or server error");
        } finally {
            setLoading(false);
            router.push("/");
        }
    };

    useEffect(() => {
        setDisable(!(userData.email.length > 0 && userData.password.length > 0));
    }, [userData]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700 text-white">
                <h2 className="text-3xl font-semibold text-center mb-6">Login to Your Account</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={onLogin}
                        disabled={disabled || loading}
                        className={`w-full py-2 rounded-full transition duration-300 ${disabled
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className={`text-sm text-center ${success ? "text-green-400" : "text-red-400"}`}>
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4 space-x-4 text-sm text-gray-600">
                    <p className="m-0">
                        <Link href="/forgotPassword/step1" className="text-blue-500 hover:underline">
                        Forgot Password?
                        </Link>
                    </p>
                    <p className="m-0">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                        </Link>
                    </p>
                </div>
            </div>
            <Toaster
                position="top-center"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: 'green',
                            color: 'white',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: 'red',
                            color: 'white',
                        },
                    },
                }}
            />
        </div>
    );
}
