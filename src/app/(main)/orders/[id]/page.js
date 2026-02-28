"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

const STEPS = [
    { key: "new", label: "Order Placed", icon: "receipt_long", desc: "Your order has been received" },
    { key: "cooking", label: "Preparing", icon: "skillet", desc: "The kitchen is cooking your food" },
    { key: "ready", label: "Ready", icon: "takeout_dining", desc: "Packed & ready for pickup" },
    { key: "delivered", label: "Delivered", icon: "check_circle", desc: "Enjoy your meal!" },
];

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (!error && data) {
            setOrder(data);

            const { data: orderItems } = await supabase
                .from("order_items")
                .select("*, menu_items(name, image, price)")
                .eq("order_id", data.id);

            if (orderItems) setItems(orderItems);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();
        const interval = setInterval(fetchOrder, 10000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading) {
        return (
            <div className="pb-nav flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-emerald/30 border-t-emerald rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="pb-nav">
                <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-600">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                </header>
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3">search_off</span>
                    <p className="text-sm font-medium text-gray-500">Order not found</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
    const isDelivered = order.status === "delivered";
    const mins = Math.round((Date.now() - new Date(order.created_at).getTime()) / 60000);
    const orderTime = new Date(order.created_at).toLocaleString([], {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className="pb-nav">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 press-scale">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-[15px] font-bold text-gray-900">{order.display_id}</h1>
                        <p className="text-[10px] text-gray-400">{orderTime}</p>
                    </div>
                    <div className="w-6" /> {/* spacer for centering */}
                </div>
            </header>

            <main className="px-5 py-5 space-y-5">
                {/* Status Banner */}
                <div className={`rounded-2xl p-5 text-center ${isDelivered
                        ? "bg-emerald-50 border border-emerald-100"
                        : "bg-amber-50 border border-amber-100"
                    }`}>
                    <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${isDelivered ? "bg-emerald-100" : "bg-amber-100"
                        }`}>
                        <span className={`material-symbols-outlined text-[28px] filled ${isDelivered ? "text-emerald-600" : "text-amber-600"
                            }`}>
                            {isDelivered ? "check_circle" : STEPS[currentStepIndex]?.icon || "pending"}
                        </span>
                    </div>
                    <h2 className={`text-lg font-bold ${isDelivered ? "text-emerald-700" : "text-amber-700"}`}>
                        {STEPS[currentStepIndex]?.label || "Processing"}
                    </h2>
                    <p className={`text-[12px] mt-1 ${isDelivered ? "text-emerald-600" : "text-amber-600"}`}>
                        {STEPS[currentStepIndex]?.desc}
                    </p>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-[13px] font-bold text-gray-900 mb-4">Order Progress</h3>
                    <div className="space-y-0">
                        {STEPS.map((step, i) => {
                            const isCompleted = i <= currentStepIndex;
                            const isActive = i === currentStepIndex;
                            const isLast = i === STEPS.length - 1;

                            return (
                                <div key={step.key} className="flex gap-3">
                                    {/* Dot + Line */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${isActive
                                                    ? "bg-emerald-500 ring-4 ring-emerald-100"
                                                    : isCompleted
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-200"
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined text-[14px] ${isCompleted ? "text-white filled" : "text-gray-400"
                                                }`}>
                                                {isCompleted && !isActive ? "check" : step.icon}
                                            </span>
                                        </div>
                                        {!isLast && (
                                            <div className={`w-0.5 h-8 ${i < currentStepIndex ? "bg-emerald-400" : "bg-gray-200"
                                                }`} />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className="pb-8">
                                        <p className={`text-[13px] font-semibold leading-none mt-1 ${isActive ? "text-emerald-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                                            }`}>
                                            {step.label}
                                        </p>
                                        <p className={`text-[10px] mt-1 ${isCompleted ? "text-gray-400" : "text-gray-300"
                                            }`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-[13px] font-bold text-gray-900 mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                {item.menu_items?.image && (
                                    <img
                                        src={item.menu_items.image}
                                        alt={item.menu_items?.name}
                                        className="w-12 h-12 rounded-xl object-cover flex-none"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-800 truncate">
                                        {item.menu_items?.name || "Item"}
                                    </p>
                                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-[13px] font-bold text-gray-700 shrink-0">
                                    ₹{item.price_at_time * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                        <span className="text-[13px] font-bold text-gray-900">Total</span>
                        <span className="text-[15px] font-bold text-emerald-600">₹{order.total_amount}</span>
                    </div>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                    <h3 className="text-[13px] font-bold text-gray-900">Order Info</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Order ID</p>
                            <p className="text-[13px] font-semibold text-gray-700 mt-0.5">{order.display_id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Customer</p>
                            <p className="text-[13px] font-semibold text-gray-700 mt-0.5">{order.customer_name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Placed</p>
                            <p className="text-[13px] font-semibold text-gray-700 mt-0.5">{orderTime}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Status</p>
                            <p className={`text-[13px] font-semibold mt-0.5 capitalize ${isDelivered ? "text-emerald-600" : "text-amber-600"
                                }`}>{order.status}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
