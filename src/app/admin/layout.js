"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const adminNav = [
    { name: "Dashboard", href: "/admin", icon: "dashboard" },
    { name: "Orders", href: "/admin/orders", icon: "receipt_long" },
    { name: "Menu", href: "/admin/menu", icon: "restaurant_menu" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    const sidebarWidth = isDesktopCollapsed ? "w-20" : "w-64";
    const mainMargin = isDesktopCollapsed ? "lg:ml-20" : "lg:ml-64";

    return (
        <div className="min-h-screen bg-surface flex selection:bg-emerald-light/30">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`${sidebarWidth} bg-emerald text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <div className="p-4 lg:p-6 flex-1 overflow-y-auto no-scrollbar">
                    <div className="flex items-center gap-3 mb-8 group">
                        <Link href="/" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                            <span className="material-symbols-outlined text-white text-[24px]">storefront</span>
                        </Link>
                        {!isDesktopCollapsed && (
                            <span className="font-display tracking-wide text-lg whitespace-nowrap overflow-hidden transition-all duration-300">Cloud Kitchen</span>
                        )}
                    </div>

                    {!isDesktopCollapsed && (
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-light/60 mb-3 px-2">
                            Operations
                        </div>
                    )}
                    <nav className="space-y-1.5">
                        {adminNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    title={isDesktopCollapsed ? item.name : undefined}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${isDesktopCollapsed ? 'justify-center' : 'gap-3'} ${isActive
                                        ? "bg-white/15 text-white font-medium shadow-none"
                                        : "text-emerald-50/70 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[22px] shrink-0 ${isActive ? "filled" : ""}`}>
                                        {item.icon}
                                    </span>
                                    {!isDesktopCollapsed && (
                                        <span className="text-sm whitespace-nowrap overflow-hidden">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 lg:p-6 mb-safe">
                    <div className={`bg-emerald-dark/50 rounded-xl p-3 flex items-center border border-white/5 ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-[20px]">admin_panel_settings</span>
                        </div>
                        {!isDesktopCollapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">Admin User</p>
                                <p className="text-[11px] text-emerald-light/80 truncate">Manager</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${mainMargin} flex flex-col min-h-screen w-full min-w-0`}>
                {/* Top Header */}
                <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button
                            className="lg:hidden p-1.5 -ml-1 text-surface-dark hover:bg-gray-50 rounded-lg shrink-0"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined text-[24px] leading-none">menu</span>
                        </button>
                        <button
                            className="hidden lg:flex p-1.5 -ml-2 text-gray-400 hover:text-surface-dark hover:bg-gray-50 rounded-lg shrink-0 transition-colors"
                            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        >
                            <span className="material-symbols-outlined text-[24px] leading-none">
                                {isDesktopCollapsed ? "menu_open" : "menu"}
                            </span>
                        </button>
                        <h1 className="text-lg lg:text-xl font-bold text-surface-dark capitalize truncate">
                            {pathname === '/admin' ? 'Overview' : pathname.split('/').pop()}
                        </h1>
                        <div className="hidden lg:block h-5 w-[1px] bg-gray-200"></div>
                        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald/10 ml-auto lg:ml-0">
                            <div className="w-2 h-2 rounded-full bg-emerald"></div>
                            <span className="text-[11px] font-bold text-emerald uppercase tracking-wider">Accepting Orders</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        <span className="hidden md:block text-sm font-medium text-gray-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-8 flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
