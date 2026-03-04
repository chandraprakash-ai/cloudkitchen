"use client";
import { useState } from "react";

export default function LoginModal({ isOpen, onClose, onSuccess, signIn, signUp }) {
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

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
                // For Supabase, sign up might require email verification, but usually auto-signs in if email confirm is false
                // Assuming success here proceeds
                if (onSuccess) onSuccess();
                onClose();
            }
        } else {
            const { error: err } = await signIn(email, password);
            if (err) {
                setError(err.message === "Invalid login credentials" ? "Wrong email or password" : err.message);
            } else {
                if (onSuccess) onSuccess();
                onClose();
            }
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl animate-scale-up relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-emerald text-white flex items-center justify-center rounded-2xl mx-auto mb-3 shadow-lg shadow-emerald/20">
                            <span className="material-symbols-outlined text-[26px]">soup_kitchen</span>
                        </div>
                        <h2 className="font-display text-xl text-surface-dark leading-tight mb-1">
                            {mode === "signin" ? "Sign In to Continue" : "Create an Account"}
                        </h2>
                        <p className="text-[12px] text-gray-400">
                            {mode === "signin" ? "Please sign in to complete this action" : "Join us to complete this action"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && (
                            <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[12px] font-medium text-center">
                                {error}
                            </div>
                        )}

                        {mode === "signup" && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[16px]">person</span>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[16px]">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[16px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength={6}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald text-white rounded-xl py-3 mt-2 text-sm font-bold hover:bg-emerald-dark transition-colors active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === "signin" ? "Sign In" : "Create Account"}
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        {mode === "signin" ? (
                            <p className="text-[12px] text-gray-500">
                                New here?{" "}
                                <button onClick={() => { setMode("signup"); setError(""); }} className="text-emerald font-bold hover:underline">
                                    Create an account
                                </button>
                            </p>
                        ) : (
                            <p className="text-[12px] text-gray-500">
                                Already have an account?{" "}
                                <button onClick={() => { setMode("signin"); setError(""); }} className="text-emerald font-bold hover:underline">
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
