"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
    const { user, displayName, signOut } = useAuth();
    const [orderCount, setOrderCount] = useState(0);
    const [address, setAddress] = useState("");
    const [editingAddress, setEditingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [storeSettings, setStoreSettings] = useState(null);

    useEffect(() => {
        const savedAddress = localStorage.getItem("ck-profile-address");
        if (savedAddress) setAddress(savedAddress);
        const savedNotif = localStorage.getItem("ck-notifications");
        if (savedNotif === "true") setNotificationsEnabled(true);

        // Fetch real order count — use auth user id or guest id
        const userId = user?.id || localStorage.getItem("guest_user_id");
        if (userId) {
            supabase
                .from("orders")
                .select("id", { count: "exact", head: true })
                .eq("guest_user_id", userId)
                .then(({ count }) => {
                    if (count !== null) setOrderCount(count);
                });
        }

        // Fetch store settings
        supabase
            .from("store_settings")
            .select("*")
            .eq("id", 1)
            .single()
            .then(({ data }) => {
                if (data) setStoreSettings(data);
            });
    }, [user]);

    // Address editing
    const startEditAddress = () => { setAddressInput(address); setEditingAddress(true); };
    const saveAddress = () => {
        const trimmed = addressInput.trim();
        setAddress(trimmed);
        localStorage.setItem("ck-profile-address", trimmed);
        setEditingAddress(false);
    };

    // Notifications
    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            if ("Notification" in window) {
                const perm = await Notification.requestPermission();
                if (perm === "granted") {
                    setNotificationsEnabled(true);
                    localStorage.setItem("ck-notifications", "true");
                    new Notification("Cloud Kitchen", { body: "Notifications enabled!", icon: "/favicon.ico" });
                }
            }
        } else {
            setNotificationsEnabled(false);
            localStorage.setItem("ck-notifications", "false");
        }
    };

    const handleSignOut = async () => {
        await signOut();
        localStorage.removeItem("guest_user_id");
    };

    const profileName = displayName || "Guest User";
    const isLoggedIn = !!user;

    return (
        <div className="pb-nav">
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
                    <h2 className="text-lg font-bold text-surface-dark">{profileName}</h2>
                    {isLoggedIn && (
                        <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-emerald text-[13px] filled">eco</span>
                            <span className="text-[10px] font-bold text-emerald uppercase tracking-wider">Veg Enthusiast</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.1s" }}>
                    <Link href="/orders" className="flex-1 bg-white rounded-xl p-3 text-center hover:bg-gray-50 transition-colors press-scale">
                        <div className="text-xl font-bold text-emerald-dark">{orderCount}</div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">Orders</div>
                    </Link>
                    <div className="flex-1 bg-white rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-emerald-dark">{address ? "1" : "0"}</div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">Addresses</div>
                    </div>
                    <Link href="/menu" className="flex-1 bg-white rounded-xl p-3 text-center hover:bg-gray-50 transition-colors press-scale">
                        <div className="text-xl font-bold text-emerald-dark">
                            <span className="material-symbols-outlined text-emerald text-[22px]">restaurant_menu</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">Menu</div>
                    </Link>
                </div>

                {/* Account */}
                <div className="space-y-1 animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.15s" }}>
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Account</h3>

                    {/* Auth action — sign in or sign out */}
                    {!isLoggedIn ? (
                        <Link
                            href="/login"
                            className="w-full bg-emerald text-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-emerald-dark transition-colors press-scale"
                        >
                            <span className="material-symbols-outlined text-white text-[20px]">login</span>
                            <span className="text-sm font-bold flex-1 text-left">Sign In / Create Account</span>
                            <span className="material-symbols-outlined text-white/60 text-[18px]">chevron_right</span>
                        </Link>
                    ) : (
                        <div className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald text-[20px]">person</span>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-surface-dark block">{profileName}</span>
                                <span className="text-[11px] text-gray-400">{user.email}</span>
                            </div>
                            <div className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald uppercase">Verified</div>
                        </div>
                    )}

                    {/* Saved Addresses */}
                    {editingAddress ? (
                        <div className="bg-white rounded-xl px-4 py-3 space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivery Address</label>
                            <textarea
                                value={addressInput}
                                onChange={(e) => setAddressInput(e.target.value)}
                                placeholder="Enter your full delivery address"
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/10 transition-all resize-none"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setEditingAddress(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold press-scale">Cancel</button>
                                <button onClick={saveAddress} className="px-4 py-2 rounded-xl bg-emerald text-white text-sm font-bold press-scale hover:bg-emerald-dark transition-colors">Save</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={startEditAddress}
                            className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors press-scale"
                        >
                            <span className="material-symbols-outlined text-emerald text-[20px]">location_on</span>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-surface-dark block">Saved Address</span>
                                <span className="text-[11px] text-gray-400 line-clamp-1">{address || "Tap to add your delivery address"}</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                        </button>
                    )}

                    {/* Payment — COD */}
                    <div className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald text-[20px]">payments</span>
                        <div className="flex-1 text-left">
                            <span className="text-sm font-medium text-surface-dark block">Payment Method</span>
                            <span className="text-[11px] text-gray-400">Cash on Delivery (COD)</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald uppercase">Active</div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="space-y-1 animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.2s" }}>
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Preferences</h3>

                    <button onClick={toggleNotifications} className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-emerald text-[20px]">notifications</span>
                        <span className="text-sm font-medium text-surface-dark flex-1 text-left">Push Notifications</span>
                        <div className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${notificationsEnabled ? "bg-emerald" : "bg-gray-300"}`}>
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notificationsEnabled ? "right-0.5" : "left-0.5"}`}></div>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors press-scale"
                    >
                        <span className="material-symbols-outlined text-emerald text-[20px]">help</span>
                        <span className="text-sm font-medium text-surface-dark flex-1 text-left">Help & Support</span>
                        <span className={`material-symbols-outlined text-gray-400 text-[18px] transition-transform ${showHelp ? "rotate-90" : ""}`}>chevron_right</span>
                    </button>
                    {showHelp && (
                        <div className="bg-white rounded-xl px-4 py-3 space-y-2 animate-slide-up" style={{ animationDuration: "0.2s" }}>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-symbols-outlined text-[16px] text-emerald">call</span>
                                <span>Call us: <a href={`tel:${storeSettings?.contact_phone?.replace(/[^0-9+]/g, '') || "+919876543210"}`} className="text-emerald font-medium">{storeSettings?.contact_phone || "+91 98765 43210"}</a></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-symbols-outlined text-[16px] text-emerald">mail</span>
                                <span>Email: <a href={`mailto:${storeSettings?.contact_email || "support@cloudkitchen.in"}`} className="text-emerald font-medium">{storeSettings?.contact_email || "support@cloudkitchen.in"}</a></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-symbols-outlined text-[16px] text-emerald">schedule</span>
                                <span>Hours: {storeSettings?.contact_hours || "10 AM – 10 PM, Mon–Sun"}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setShowAbout(!showAbout)}
                        className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors press-scale"
                    >
                        <span className="material-symbols-outlined text-emerald text-[20px]">info</span>
                        <span className="text-sm font-medium text-surface-dark flex-1 text-left">About Cloud Kitchen</span>
                        <span className={`material-symbols-outlined text-gray-400 text-[18px] transition-transform ${showAbout ? "rotate-90" : ""}`}>chevron_right</span>
                    </button>
                    {showAbout && (
                        <div className="bg-white rounded-xl px-4 py-3 space-y-2 animate-slide-up" style={{ animationDuration: "0.2s" }}>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Cloud Kitchen serves fresh, wholesome <strong>100% vegetarian</strong> meals made with love.
                            </p>
                            <div className="flex items-center gap-4 pt-1">
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <span className="material-symbols-outlined text-[14px]">eco</span> Pure Veg
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Made Fresh
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span> 30 min
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sign Out */}
                {isLoggedIn && (
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 justify-center hover:bg-red-50 transition-colors press-scale border border-gray-100"
                    >
                        <span className="material-symbols-outlined text-red-500 text-[20px]">logout</span>
                        <span className="text-sm font-bold text-red-500">Sign Out</span>
                    </button>
                )}

                <p className="text-center text-[10px] text-gray-400 pb-4">v 1.0.0</p>
            </main>
        </div>
    );
}
