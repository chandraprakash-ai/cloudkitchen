"use client";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="pb-nav">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <Link href="/" className="p-1 -ml-1 press-scale">
                    <span className="material-symbols-outlined text-surface-dark text-[22px]">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold text-surface-dark">Profile</h1>
            </header>

            <main className="px-4 py-6 space-y-6">
                {/* Profile Card */}
                <div className="flex flex-col items-center text-center animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-3 ring-3 ring-emerald/20">
                        <span className="material-symbols-outlined text-emerald text-[36px]">person</span>
                    </div>
                    <h2 className="text-lg font-bold text-surface-dark">Guest User</h2>
                    <p className="text-[12px] text-gray-500 mt-0.5">Sign in for a personalized experience</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-emerald text-[13px] filled">eco</span>
                            <span className="text-[10px] font-bold text-emerald uppercase tracking-wider">Veg Enthusiast</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.1s" }}>
                    {[
                        { value: "0", label: "Orders" },
                        { value: "0", label: "Reviews" },
                        { value: "0", label: "Saved" },
                    ].map((stat) => (
                        <div key={stat.label} className="flex-1 bg-white rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-emerald-dark">{stat.value}</div>
                            <div className="text-[10px] text-gray-500 font-medium mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Account Section */}
                <div className="space-y-1 animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.15s" }}>
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Account</h3>
                    {[
                        { icon: "person", label: "Personal Details", chevron: true },
                        { icon: "location_on", label: "Saved Addresses", chevron: true },
                        { icon: "credit_card", label: "Payment Methods", chevron: true },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors press-scale"
                        >
                            <span className="material-symbols-outlined text-emerald text-[20px]">{item.icon}</span>
                            <span className="text-sm font-medium text-surface-dark flex-1 text-left">{item.label}</span>
                            {item.chevron && (
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Preferences */}
                <div className="space-y-1 animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.2s" }}>
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Preferences</h3>
                    <div className="bg-white rounded-xl px-4 py-3.5 flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald text-[20px]">notifications</span>
                        <span className="text-sm font-medium text-surface-dark flex-1">Push Notifications</span>
                        <div className="w-11 h-6 bg-emerald rounded-full relative cursor-pointer press-scale">
                            <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"></div>
                        </div>
                    </div>
                    {[
                        { icon: "help", label: "Help & Support" },
                        { icon: "info", label: "About Cloud Kitchen" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors press-scale"
                        >
                            <span className="material-symbols-outlined text-emerald text-[20px]">{item.icon}</span>
                            <span className="text-sm font-medium text-surface-dark flex-1 text-left">{item.label}</span>
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                        </button>
                    ))}
                </div>

                {/* Login Button */}
                <button className="w-full h-12 rounded-xl bg-emerald text-white font-bold text-sm flex items-center justify-center gap-2 press-scale hover:bg-emerald-dark transition-colors animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.25s" }}>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    Sign In / Create Account
                </button>

                <p className="text-center text-[10px] text-gray-400 pb-4">v 1.0.0</p>
            </main>
        </div>
    );
}
