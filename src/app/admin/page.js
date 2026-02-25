"use client";

const recentOrders = [
    { id: "#ORD-8821", total: "₹510", items: "2 items", time: "2 mins ago", status: "New", statusColor: "blue" },
    { id: "#ORD-8820", total: "₹890", items: "4 items", time: "15 mins ago", status: "Cooking", statusColor: "saffron" },
    { id: "#ORD-8819", total: "₹345", items: "1 item", time: "42 mins ago", status: "Out for Delivery", statusColor: "purple" },
    { id: "#ORD-8818", total: "₹1,250", items: "6 items", time: "1 hr ago", status: "Delivered", statusColor: "emerald" },
];

export default function AdminDashboard() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                    { label: "Today's Sales", value: "₹12,450", trend: "+14%", isPositive: true },
                    { label: "Active Orders", value: "24", trend: "+5", isPositive: true },
                    { label: "Avg Prep Time", value: "18m", trend: "-2m", isPositive: true },
                    { label: "Canceled", value: "1", trend: "-2", isPositive: true },
                ].map((metric, i) => (
                    <div key={metric.label} className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up opacity-0 stagger-${i + 1}`} style={{ animationFillMode: 'forwards' }}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{metric.label}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${metric.isPositive ? 'bg-emerald-50 text-emerald-dark' : 'bg-red-50 text-red-600'}`}>
                                <span className="material-symbols-outlined text-[14px]">
                                    {metric.trend.includes('+') ? 'trending_up' : 'trending_down'}
                                </span>
                                {metric.trend}
                            </span>
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
                        <button className="text-[12px] font-bold text-emerald hover:underline">View All</button>
                    </div>
                    <div className="p-0 overflow-x-auto">
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
                                            <div className="font-medium text-sm text-surface-dark">{order.id}</div>
                                            <div className="text-[11px] text-gray-500">{order.items}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.time}</td>
                                        <td className="px-6 py-4 font-bold text-surface-dark">{order.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${order.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                order.status === 'Cooking' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                    order.status === 'Out for Delivery' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Items List */}
                <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6 animate-slide-up opacity-0 stagger-6" style={{ animationFillMode: 'forwards' }}>
                    <h2 className="text-lg font-bold text-surface-dark mb-4 lg:mb-6">Top Performers</h2>
                    <div className="space-y-4">
                        {[
                            { name: "Clay Pot Veg Biryani", sold: 42, revenue: "₹8,358" },
                            { name: "Royal Paneer Thali", sold: 38, revenue: "₹9,462" },
                            { name: "Farmhouse Pizza", sold: 29, revenue: "₹8,671" },
                            { name: "Mango Lassi", sold: 56, revenue: "₹5,544" },
                        ].map((item, i) => (
                            <div key={item.name} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald flex items-center justify-center font-bold text-xs shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-surface-dark truncate">{item.name}</h4>
                                    <p className="text-[11px] text-gray-500">{item.sold} sold today</p>
                                </div>
                                <div className="font-bold text-sm text-surface-dark">{item.revenue}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
