"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

const STATUS_CONFIG = {
    ready: { label: "Ready for Pickup", icon: "takeout_dining", color: "amber" },
    delivered: { label: "Delivered", icon: "check_circle", color: "emerald" },
};

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState({ ready: [], delivered: [] });
    const [loading, setLoading] = useState(true);
    const [delivering, setDelivering] = useState(null); // order ID being delivered
    const [tab, setTab] = useState("ready");

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    quantity,
                    price_at_time,
                    menu_items ( name )
                )
            `)
            .in("status", ["ready", "delivered"])
            .order("created_at", { ascending: false });

        if (!error && data) {
            const grouped = { ready: [], delivered: [] };
            data.forEach((order) => {
                if (grouped[order.status]) {
                    grouped[order.status].push(order);
                }
            });
            setOrders(grouped);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const markDelivered = async (orderId) => {
        setDelivering(orderId);

        // Optimistic update
        setOrders((prev) => {
            const order = prev.ready.find((o) => o.id === orderId);
            if (!order) return prev;
            const updated = { ...order, status: "delivered" };
            return {
                ready: prev.ready.filter((o) => o.id !== orderId),
                delivered: [updated, ...prev.delivered],
            };
        });

        const { error } = await supabase
            .from("orders")
            .update({ status: "delivered" })
            .eq("id", orderId);

        if (error) {
            console.error("Failed to mark delivered:", error);
            fetchOrders(); // revert
        }
        setDelivering(null);
    };

    const timeSince = (created) => {
        const mins = Math.round((Date.now() - new Date(created).getTime()) / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m ago`;
    };

    const readyCount = orders.ready.length;
    const deliveredCount = orders.delivered.length;
    const activeOrders = tab === "ready" ? orders.ready : orders.delivered;

    return (
        <div className="max-w-lg mx-auto">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Deliveries</h1>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {readyCount} pending • {deliveredCount} completed today
                        </p>
                    </div>
                    <button
                        onClick={() => { setLoading(true); fetchOrders(); }}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
                            refresh
                        </span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                        const count = key === "ready" ? readyCount : deliveredCount;
                        const isActive = tab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${isActive
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[14px] mr-1 align-[-3px]">
                                    {cfg.icon}
                                </span>
                                {cfg.label}
                                {count > 0 && (
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isActive ? "bg-white/20" : "bg-gray-300/50"
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* Orders List */}
            <main className="px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-3" />
                        <p className="text-sm text-gray-400">Loading orders...</p>
                    </div>
                ) : activeOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-gray-300 text-[32px]">
                                {tab === "ready" ? "takeout_dining" : "inventory_2"}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            {tab === "ready" ? "No orders ready for pickup" : "No deliveries yet today"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                            {tab === "ready" ? "New orders will appear here automatically" : "Completed orders will show up here"}
                        </p>
                    </div>
                ) : (
                    activeOrders.map((order, i) => {
                        const itemLines = order.order_items?.map(
                            (oi) => `${oi.quantity}× ${oi.menu_items?.name || "Item"}`
                        ) || [];
                        const isDelivered = order.status === "delivered";

                        return (
                            <div
                                key={order.id}
                                className={`bg-white rounded-2xl border overflow-hidden transition-all ${isDelivered ? "border-gray-100 opacity-60" : "border-gray-200 shadow-sm"
                                    }`}
                            >
                                {/* Card header */}
                                <div className="px-4 pt-4 pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isDelivered ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                                            <span className="text-[13px] font-bold text-gray-900">
                                                {order.display_id}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {timeSince(order.created_at)}
                                        </span>
                                    </div>

                                    {/* Customer */}
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <span className="material-symbols-outlined text-[14px] text-gray-400">person</span>
                                        <span className="text-[12px] text-gray-500 font-medium">{order.customer_name || "Guest"}</span>
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-1">
                                        {itemLines.map((line, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="text-[12px] text-gray-600">{line}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card footer */}
                                <div className={`px-4 py-3 flex items-center justify-between border-t ${isDelivered ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-100"
                                    }`}>
                                    <span className="text-[14px] font-bold text-gray-900">₹{order.total_amount}</span>

                                    {isDelivered ? (
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                                            <span className="text-[11px] font-bold">Delivered</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => markDelivered(order.id)}
                                            disabled={delivering === order.id}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${delivering === order.id
                                                    ? "bg-gray-200 text-gray-400 cursor-wait"
                                                    : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm press-scale"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                {delivering === order.id ? "hourglass_top" : "check_circle"}
                                            </span>
                                            {delivering === order.id ? "Updating..." : "Mark Delivered"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}
