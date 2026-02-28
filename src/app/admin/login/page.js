"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulated local authentication
        setTimeout(() => {
            if (username === "admin" && password === "admin1234") {
                localStorage.setItem("adminAuth", "true");
                router.push("/admin");
            } else {
                setError("Invalid Operator ID or Passcode.");
            }
            setIsLoading(false);
        }, 600);
    };


    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 selection:bg-emerald-light/30 filter relative overflow-hidden">
            {/* Architectural ambient shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-emerald-50 rounded-[40%] blur-[120px] opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-gold-light/20 rounded-full blur-[100px] opacity-60"></div>

            <div className="w-full max-w-[420px] z-10 animate-fade-in">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-emerald text-white flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-xl shadow-emerald/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[32px]">soup_kitchen</span>
                    </div>
                    <h1 className="font-display text-4xl text-surface-dark mb-2 tracking-tight">System Access</h1>
                    <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">Cloud Kitchen Operations</p>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-slide-up text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-emerald transition-colors">Operator ID</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-emerald transition-colors">badge</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username (e.g. admin)"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-4 focus:ring-emerald/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-emerald transition-colors">Passcode</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-emerald transition-colors">key</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-4 focus:ring-emerald/10 transition-all font-sans"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-surface-dark text-white rounded-2xl py-4 text-sm font-bold uppercase tracking-wider hover:bg-emerald transition-colors duration-300 shadow-xl shadow-surface-dark/10 hover:shadow-emerald/20 disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Authenticate
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Authorized Personnel Only
                </p>
            </div>
        </div>
    );
}
