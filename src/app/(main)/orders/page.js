"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

const STATUS_LABELS = {
    new: { label: "Placed", color: "blue", icon: "receipt_long" },
    cooking: { label: "Cooking", color: "amber", icon: "skillet" },
    ready: { label: "Ready", color: "orange", icon: "takeout_dining" },
    delivered: { label: "Delivered", color: "emerald", icon: "check_circle" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("active"); // active | history

    useEffect(() => {
        async function fetchOrders() {
            const { data, error } = await supabase
                .from("orders")
                .select(`
                    *,
                    order_items (
                        quantity,
                        price_at_time,
                        menu_items ( name, image )
                    )
                `)
                .order("created_at", { ascending: false });

            if (!error && data) setOrders(data);
            setLoading(false);
        }
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const activeOrders = orders.filter((o) => ["new", "cooking", "ready"].includes(o.status));
    const historyOrders = orders.filter((o) => o.status === "delivered");
    const displayOrders = tab === "active" ? activeOrders : historyOrders;

    const timeSince = (created) => {
        const mins = Math.round((Date.now() - new Date(created).getTime()) / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="pb-nav">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 pt-5 pb-4">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-4">My Orders</h1>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab("active")}
                        className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${tab === "active"
                                ? "bg-emerald text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        Active
                        {activeOrders.length > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${tab === "active" ? "bg-white/20" : "bg-gray-300/50"
                                }`}>
                                {activeOrders.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab("history")}
                        className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${tab === "history"
                                ? "bg-emerald text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        History
                        {historyOrders.length > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${tab === "history" ? "bg-white/20" : "bg-gray-300/50"
                                }`}>
                                {historyOrders.length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald/30 border-t-emerald rounded-full animate-spin mb-3" />
                        <p className="text-sm text-gray-400">Loading orders...</p>
                    </div>
                ) : displayOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-gray-300 text-[32px]">
                                {tab === "active" ? "pending" : "inventory_2"}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            {tab === "active" ? "No active orders" : "No order history yet"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                            {tab === "active" ? "Orders you place will appear here" : "Completed orders will show up here"}
                        </p>
                        {tab === "active" && (
                            <Link
                                href="/menu"
                                className="mt-4 px-5 py-2.5 rounded-xl bg-emerald text-white text-[12px] font-bold press-scale"
                            >
                                Browse Menu
                            </Link>
                        )}
                    </div>
                ) : (
                    displayOrders.map((order) => {
                        const cfg = STATUS_LABELS[order.status] || STATUS_LABELS.new;
                        const itemNames = order.order_items
                            ?.map((oi) => `${oi.quantity}× ${oi.menu_items?.name || "Item"}`)
                            .slice(0, 3) || [];
                        const moreCount = (order.order_items?.length || 0) > 3 ? order.order_items.length - 3 : 0;
                        const firstImage = order.order_items?.find((oi) => oi.menu_items?.image)?.menu_items?.image;

                        return (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow press-scale"
                            >
                                <div className="p-4 flex gap-3">
                                    {/* Thumbnail */}
                                    {firstImage && (
                                        <img
                                            src={firstImage}
                                            alt=""
                                            className="w-16 h-16 rounded-xl object-cover flex-none"
                                        />
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[13px] font-bold text-gray-900">{order.display_id}</span>
                                            <span className="text-[10px] text-gray-400">{timeSince(order.created_at)}</span>
                                        </div>

                                        <p className="text-[11px] text-gray-500 truncate mb-2">
                                            {itemNames.join(", ")}{moreCount > 0 ? ` +${moreCount} more` : ""}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] font-bold text-gray-800">₹{order.total_amount}</span>
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-${cfg.color}-50 text-${cfg.color}-600`}>
                                                <span className="material-symbols-outlined text-[12px] filled">{cfg.icon}</span>
                                                <span className="text-[10px] font-bold">{cfg.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </main>
        </div>
    );
}
