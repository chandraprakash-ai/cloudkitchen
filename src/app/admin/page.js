"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState({
        todaySales: 0,
        activeOrders: 0,
        totalOrders: 0,
        deliveredToday: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayISO = todayStart.toISOString();

            // Fetch all orders created today
            const { data: todayOrders } = await supabase
                .from("orders")
                .select("id, display_id, customer_name, status, total_amount, created_at")
                .gte("created_at", todayISO)
                .order("created_at", { ascending: false });

            const orders = todayOrders || [];
            const todaySales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
            const activeOrders = orders.filter(o => ["new", "cooking", "ready"].includes(o.status)).length;
            const deliveredToday = orders.filter(o => o.status === "delivered").length;

            setMetrics({
                todaySales,
                activeOrders,
                totalOrders: orders.length,
                deliveredToday,
            });

            // Recent orders (last 6)
            const { data: recent } = await supabase
                .from("orders")
                .select("id, display_id, customer_name, status, total_amount, created_at")
                .order("created_at", { ascending: false })
                .limit(6);

            setRecentOrders(recent || []);

            // Top menu items (by order count)
            const { data: orderItems } = await supabase
                .from("order_items")
                .select("menu_item_id, quantity, price_at_time, menu_items(name)");

            if (orderItems) {
                const itemMap = {};
                orderItems.forEach(oi => {
                    const id = oi.menu_item_id;
                    if (!itemMap[id]) {
                        itemMap[id] = { name: oi.menu_items?.name || "Unknown", sold: 0, revenue: 0 };
                    }
                    itemMap[id].sold += oi.quantity;
                    itemMap[id].revenue += oi.quantity * oi.price_at_time;
                });
                const sorted = Object.values(itemMap).sort((a, b) => b.sold - a.sold).slice(0, 5);
                setTopItems(sorted);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const timeSince = (dateStr) => {
        const mins = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const statusStyle = (s) => {
        const map = {
            new: "bg-blue-50 text-blue-700 border-blue-100",
            cooking: "bg-orange-50 text-orange-700 border-orange-100",
            ready: "bg-purple-50 text-purple-700 border-purple-100",
            delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
        };
        return map[s] || "bg-gray-50 text-gray-700 border-gray-100";
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-emerald border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                    { label: "Today's Sales", value: `₹${metrics.todaySales.toLocaleString("en-IN")}`, icon: "currency_rupee" },
                    { label: "Active Orders", value: String(metrics.activeOrders), icon: "pending_actions" },
                    { label: "Total Today", value: String(metrics.totalOrders), icon: "receipt_long" },
                    { label: "Delivered", value: String(metrics.deliveredToday), icon: "check_circle" },
                ].map((metric, i) => (
                    <div key={metric.label} className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up opacity-0 stagger-${i + 1}`} style={{ animationFillMode: 'forwards' }}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{metric.label}</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald text-[18px]">{metric.icon}</span>
                            </div>
                        </div>
                        <div className="font-display text-4xl text-surface-dark">{metric.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Orders Table */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm animate-slide-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
                    <div className="p-4 lg:p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-surface-dark">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-[12px] font-bold text-emerald hover:underline">View All</Link>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        {recentOrders.length === 0 ? (
                            <div className="py-12 text-center text-sm text-gray-400">No orders yet</div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="bg-surface/50 border-b border-gray-100">
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm text-surface-dark">{order.display_id}</div>
                                                <div className="text-[11px] text-gray-500">{order.customer_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{timeSince(order.created_at)}</td>
                                            <td className="px-6 py-4 font-bold text-surface-dark">₹{order.total_amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${statusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Top Items List */}
                <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6 animate-slide-up opacity-0 stagger-6" style={{ animationFillMode: 'forwards' }}>
                    <h2 className="text-lg font-bold text-surface-dark mb-4 lg:mb-6">Top Performers</h2>
                    {topItems.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">No order data yet</div>
                    ) : (
                        <div className="space-y-4">
                            {topItems.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald flex items-center justify-center font-bold text-xs shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-surface-dark truncate">{item.name}</h4>
                                        <p className="text-[11px] text-gray-500">{item.sold} sold</p>
                                    </div>
                                    <div className="font-bold text-sm text-surface-dark">₹{item.revenue.toLocaleString("en-IN")}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
