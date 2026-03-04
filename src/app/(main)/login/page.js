"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { signIn, signUp, user } = useAuth();
    const router = useRouter();
    const [mode, setMode] = useState("signin"); // "signin" or "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // If already logged in, redirect
    if (user) {
        router.push("/profile");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (mode === "signup") {
            if (!fullName.trim()) {
                setError("Please enter your name");
                setLoading(false);
                return;
            }
            const { error: err } = await signUp(email, password, fullName.trim());
            if (err) {
                setError(err.message);
            } else {
                setSuccess("Account created! Check your email to verify, then sign in.");
                setMode("signin");
            }
        } else {
            const { error: err } = await signIn(email, password);
            if (err) {
                setError(err.message === "Invalid login credentials" ? "Wrong email or password" : err.message);
            } else {
                router.push("/");
            }
        }
        setLoading(false);
    };

    return (
        <div className="pb-nav">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <Link href="/" className="p-1 -ml-1 press-scale">
                    <span className="material-symbols-outlined text-surface-dark text-[22px]">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold text-surface-dark">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                </h1>
            </header>

            <main className="px-4 py-8">
                <div className="max-w-sm mx-auto">
                    {/* Logo area */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald text-white flex items-center justify-center rounded-2xl mx-auto mb-4 shadow-lg shadow-emerald/20">
                            <span className="material-symbols-outlined text-[30px]">soup_kitchen</span>
                        </div>
                        <h2 className="font-display text-2xl text-surface-dark mb-1">
                            {mode === "signin" ? "Welcome Back" : "Join Cloud Kitchen"}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {mode === "signin" ? "Sign in to track your orders" : "Create an account to start ordering"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-emerald-50 border border-emerald/20 rounded-xl text-emerald-dark text-sm font-medium text-center">
                                {success}
                            </div>
                        )}

                        {mode === "signup" && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">person</span>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength={6}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald text-white rounded-xl py-3.5 text-sm font-bold hover:bg-emerald-dark transition-colors active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === "signin" ? "Sign In" : "Create Account"}
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        {mode === "signin" ? (
                            <p className="text-sm text-gray-500">
                                New here?{" "}
                                <button
                                    onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                                    className="text-emerald font-bold hover:underline"
                                >
                                    Create an account
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <button
                                    onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                                    className="text-emerald font-bold hover:underline"
                                >
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>

                    <p className="text-center text-[10px] text-gray-400 mt-6">
                        You can also order as a guest without signing in
                    </p>
                </div>
            </main>
        </div>
    );
}
