"use client";
import { useState } from "react";

const initialOrders = {
    new: [
        { id: "ORD-8821", time: "10:42 AM", items: ["1x Clay Pot Veg Biryani", "2x Garlic Naan"], total: "₹510", customer: "Rahul S." },
        { id: "ORD-8822", time: "10:45 AM", items: ["1x Royal Paneer Thali"], total: "₹249", customer: "Priya P." },
    ],
    cooking: [
        { id: "ORD-8820", time: "10:30 AM", items: ["4x Margherita Pizza", "2x Mango Lassi"], total: "₹890", customer: "Amit R." },
    ],
    ready: [
        { id: "ORD-8819", time: "10:15 AM", items: ["1x Super Green Salad"], total: "₹159", customer: "Sneha K." },
    ],
};

export default function OrdersManager() {
    const [orders, setOrders] = useState(initialOrders);

    const moveOrder = (orderId, fromCol, toCol) => {
        setOrders(prev => {
            const orderToMove = prev[fromCol].find(o => o.id === orderId);
            if (!orderToMove) return prev;

            return {
                ...prev,
                [fromCol]: prev[fromCol].filter(o => o.id !== orderId),
                [toCol]: [...prev[toCol], orderToMove]
            };
        });
    };

    const Column = ({ title, count, color, id, items, nextCol, nextLabel }) => (
        <div className={`flex flex-col h-[450px] lg:h-[calc(100vh-140px)] bg-${color}-50/30 rounded-2xl border border-${color}-100 overflow-hidden`}>
            <div className={`p-4 border-b border-${color}-100 bg-${color}-100 flex justify-between items-center sticky top-0 z-10`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full bg-${color}-500`}></div>
                    <h2 className={`text-sm font-bold text-${color}-900 uppercase tracking-wider`}>{title}</h2>
                </div>
                <span className={`bg-${color}-100 text-${color}-800 text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                    {count}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {items.map((order, i) => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col group animate-slide-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: `${i * 0.05}s` }}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-sm font-bold text-surface-dark">{order.id}</span>
                                <div className="text-[11px] text-gray-500 mt-0.5">{order.time}</div>
                            </div>
                            <span className="text-sm font-bold text-emerald-dark">{order.total}</span>
                        </div>

                        <div className="space-y-1 mb-4 flex-1">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs text-surface-dark/80">• {item}</div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                    {order.customer.charAt(0)}
                                </div>
                                <span className="text-[11px] font-medium text-gray-600">{order.customer}</span>
                            </div>

                            {nextCol && (
                                <button
                                    onClick={() => moveOrder(order.id, id, nextCol)}
                                    className={`opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-${color}-100 hover:bg-${color}-200 text-${color}-700 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap`}
                                >
                                    {nextLabel}
                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col animate-fade-in">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full lg:w-64 h-10 pl-9 pr-4 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-light/30 focus:border-emerald"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Filter
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-visible">
                <Column
                    id="new"
                    title="New Orders"
                    count={orders.new.length}
                    color="blue"
                    items={orders.new}
                    nextCol="cooking"
                    nextLabel="Start Cooking"
                />
                <Column
                    id="cooking"
                    title="Cooking"
                    count={orders.cooking.length}
                    color="orange"
                    items={orders.cooking}
                    nextCol="ready"
                    nextLabel="Mark Ready"
                />
                <Column
                    id="ready"
                    title="Ready / Out for Delivery"
                    count={orders.ready.length}
                    color="purple"
                    items={orders.ready}
                />
            </div>
        </div>
    );
}
