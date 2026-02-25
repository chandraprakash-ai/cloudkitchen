"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import FoodCard from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";
import { categories, menuItems } from "@/data/menu";

function MenuContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState("");
    const { totalItems, subtotal } = useCart();

    const filtered = menuItems.filter((item) => {
        const matchCategory = activeCategory === "all" || item.category === activeCategory;
        const matchSearch =
            !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="pb-nav">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3 mb-3">
                    <Link href="/" className="p-1 -ml-1 press-scale">
                        <span className="material-symbols-outlined text-surface-dark text-[22px]">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-surface-dark flex-1">Menu</h1>
                    <div className="flex items-center gap-1 text-emerald">
                        <span className="material-symbols-outlined text-[16px] filled">eco</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">100% Veg</span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[18px]">
                        search
                    </span>
                    <input
                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface text-surface-dark border-0 focus:ring-2 focus:ring-emerald-light/40 placeholder:text-gray-400 text-sm font-medium transition-all outline-none"
                        placeholder="Search dishes..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex-none px-4 py-2 rounded-full text-[12px] font-semibold transition-all press-scale ${activeCategory === cat.id
                                    ? "bg-emerald text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* Menu Grid */}
            <main className="px-4 py-4">
                <p className="text-[11px] text-gray-500 mb-3 px-1">
                    Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                </p>
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map((item, i) => (
                            <FoodCard key={item.id} item={item} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3">search_off</span>
                        <p className="text-sm font-medium text-gray-500">No dishes found</p>
                        <p className="text-[11px] text-gray-400 mt-1">Try a different search or category</p>
                    </div>
                )}
            </main>

            {/* Floating Cart Bar */}
            {totalItems > 0 && (
                <Link
                    href="/cart"
                    className="fixed bottom-[76px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[calc(var(--max-w,448px)-32px)] z-40 bg-emerald text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-xl shadow-emerald/25 press-scale animate-slide-up"
                    style={{ animationFillMode: "forwards" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-medium text-white/70">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                            <span className="text-sm font-bold">₹{subtotal}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        View Cart
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </div>
                </Link>
            )}
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={<div className="p-4 text-center text-gray-400">Loading...</div>}>
            <MenuContent />
        </Suspense>
    );
}
