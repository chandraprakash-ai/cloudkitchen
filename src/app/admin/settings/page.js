"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export default function AdminSettings() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [settingsLoading, setSettingsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [storeSettings, setStoreSettings] = useState({
        contact_phone: "",
        contact_email: "",
        contact_hours: ""
    });
    const [settingsMessage, setSettingsMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("store_settings")
                .select("*")
                .eq("id", 1)
                .single();

            if (data) {
                setStoreSettings(data);
            }
            setSettingsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSettingsMessage({ text: "", type: "" });

        const { error } = await supabase
            .from("store_settings")
            .upsert({ id: 1, ...storeSettings });

        if (error) {
            setSettingsMessage({ text: error.message, type: "error" });
        } else {
            setSettingsMessage({ text: "Settings updated successfully!", type: "success" });
            setTimeout(() => setSettingsMessage({ text: "", type: "" }), 3000);
        }
        setIsSaving(false);
    };

    const handleGrantAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            // Get the current user's session token to prove they are an admin
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setMessage({ text: "You must be logged in to do this.", type: "error" });
                setLoading(false);
                return;
            }

            const response = await fetch("/api/admin/role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to grant admin rights");
            }

            setMessage({ text: data.message, type: "success" });
            setEmail("");
        } catch (err) {
            setMessage({ text: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-display text-3xl text-surface-dark">Settings</h1>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 animate-slide-up mb-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">storefront</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-dark">Store Information</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Update the contact details displayed to customers on the profile page and help section.
                        </p>
                    </div>
                </div>

                {settingsLoading ? (
                    <div className="animate-pulse space-y-4 max-w-md">
                        <div className="h-12 bg-gray-100 rounded-2xl"></div>
                        <div className="h-12 bg-gray-100 rounded-2xl"></div>
                        <div className="h-12 bg-gray-100 rounded-2xl"></div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateSettings} className="max-w-md space-y-4">
                        {settingsMessage.text && (
                            <div className={`p-3 rounded-xl border text-sm font-medium ${settingsMessage.type === "success"
                                ? "bg-blue-50 border-blue-100 text-blue-600"
                                : "bg-red-50 border-red-100 text-red-600"
                                }`}>
                                {settingsMessage.text}
                            </div>
                        )}

                        <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] transition-colors">call</span>
                                <input
                                    type="text"
                                    value={storeSettings.contact_phone}
                                    onChange={(e) => setStoreSettings({ ...storeSettings, contact_phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-sans"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] transition-colors">mail</span>
                                <input
                                    type="email"
                                    value={storeSettings.contact_email}
                                    onChange={(e) => setStoreSettings({ ...storeSettings, contact_email: e.target.value })}
                                    placeholder="support@cloudkitchen.in"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-sans"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Business Hours</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] transition-colors">schedule</span>
                                <input
                                    type="text"
                                    value={storeSettings.contact_hours}
                                    onChange={(e) => setStoreSettings({ ...storeSettings, contact_hours: e.target.value })}
                                    placeholder="10 AM – 10 PM, Mon–Sun"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-sans"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 text-white rounded-xl px-6 py-3 text-sm font-bold hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Save Store Settings
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-dark">Manage Administrators</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Grant administrative access to existing users. They must first create an account on the main website using this email address.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleGrantAdmin} className="max-w-md space-y-4">
                    {message.text && (
                        <div className={`p-4 rounded-xl border text-sm font-medium ${message.type === "success"
                            ? "bg-emerald-50 border-emerald/20 text-emerald-dark"
                            : "bg-red-50 border-red-100 text-red-600"
                            }`}>
                            {message.type === "error" && message.text.includes("SUPABASE_SERVICE_ROLE_KEY") ? (
                                <div>
                                    <p><strong>Setup Required:</strong></p>
                                    <p className="mt-1">To enable this feature, you must add <code>SUPABASE_SERVICE_ROLE_KEY</code> to your `.env.local` file.</p>
                                    <p className="mt-2 text-xs opacity-75">You can find this key in your Supabase Dashboard under Project Settings &gt; API.</p>
                                </div>
                            ) : (
                                message.text
                            )}
                        </div>
                    )}

                    <div className="space-y-1.5 focus-within:text-emerald transition-colors">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">User Email Address</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] transition-colors">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="team@example.com"
                                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-surface-dark placeholder:text-gray-400 focus:outline-none focus:border-emerald focus:ring-4 focus:ring-emerald/10 transition-all font-sans"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-surface-dark text-white rounded-xl px-6 py-3 text-sm font-bold hover:bg-emerald transition-colors duration-300 shadow-lg shadow-surface-dark/10 hover:shadow-emerald/20 disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Grant Admin Access
                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
