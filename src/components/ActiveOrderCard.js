"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

const STEPS = [
    { key: "new", label: "Placed", icon: "receipt_long" },
    { key: "cooking", label: "Cooking", icon: "skillet" },
    { key: "ready", label: "Ready", icon: "takeout_dining" },
    { key: "delivered", label: "Delivered", icon: "check_circle" },
];

export default function ActiveOrderCard() {
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchActiveOrder() {
            try {
                if (typeof window === "undefined") return;
                const userId = localStorage.getItem("guest_user_id");

                if (!userId) {
                    setOrder(null);
                    return;
                }

                // Get latest non-delivered order
                const { data: orders, error } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("guest_user_id", userId)
                    .in("status", ["new", "cooking", "ready"])
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (error || !orders || orders.length === 0) {
                    setOrder(null);
                    return;
                }

                const activeOrder = orders[0];
                setOrder(activeOrder);

                // Fetch order items with menu item names
                const { data: orderItems } = await supabase
                    .from("order_items")
                    .select("*, menu_items(name, image)")
                    .eq("order_id", activeOrder.id);

                if (orderItems) setItems(orderItems);
            } catch (err) {
                console.error("ActiveOrderCard fetch error:", err);
            }
        }

        fetchActiveOrder();

        // Poll every 15 seconds for status updates
        const interval = setInterval(fetchActiveOrder, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!order) return null;

    const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const itemNames = items
        .map((i) => i.menu_items?.name || "Item")
        .slice(0, 3)
        .join(", ");
    const moreCount = items.length > 3 ? items.length - 3 : 0;

    // Time since order
    const mins = Math.round((Date.now() - new Date(order.created_at).getTime()) / 60000);
    const timeAgo = mins < 1 ? "Just now" : `${mins}m ago`;

    return (
        <section className="animate-slide-up" style={{ animationFillMode: "forwards" }}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* Top bar */}
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald text-[18px] filled">local_shipping</span>
                            </div>
                            <div>
                                <span className="text-[13px] font-bold text-surface-dark">Order in Progress</span>
                                <span className="text-[10px] text-gray-400 ml-1.5">{order.display_id}</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400">{timeAgo}</span>
                    </div>

                    {/* Progress Stepper */}
                    <div className="flex items-center gap-0 mb-3">
                        {STEPS.map((step, i) => {
                            const isCompleted = i < currentStepIndex;
                            const isActive = i === currentStepIndex;
                            const isPending = i > currentStepIndex;

                            return (
                                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                    {/* Dot */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="flex items-center justify-center rounded-full transition-all"
                                            style={{
                                                width: isActive ? 32 : 24,
                                                height: isActive ? 32 : 24,
                                                backgroundColor: isCompleted || isActive ? '#10b981' : '#f3f4f6',
                                            }}
                                        >
                                            <span
                                                className={`material-symbols-outlined ${isCompleted || isActive ? 'filled' : ''}`}
                                                style={{
                                                    fontSize: isActive ? 16 : 12,
                                                    color: isCompleted || isActive ? '#ffffff' : '#9ca3af',
                                                }}
                                            >
                                                {isCompleted ? "check" : step.icon}
                                            </span>
                                        </div>
                                        <span
                                            className="mt-1 text-center leading-none"
                                            style={{
                                                fontSize: 9,
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? '#10b981' : isPending ? '#9ca3af' : '#374151',
                                            }}
                                        >
                                            {step.label}
                                        </span>
                                    </div>

                                    {/* Connector line */}
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className="flex-1 h-0.5 mx-1 rounded-full"
                                            style={{
                                                backgroundColor: i < currentStepIndex ? '#10b981' : '#e5e7eb',
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom summary */}
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-500 truncate">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} • {itemNames}{moreCount > 0 ? ` +${moreCount} more` : ""}
                        </p>
                        <p className="text-[13px] font-bold text-surface-dark">₹{order.total_amount}</p>
                    </div>
                    <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald text-[11px] font-semibold hover:bg-emerald/20 transition-colors"
                    >
                        Details
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
