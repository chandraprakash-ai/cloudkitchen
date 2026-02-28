"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import FoodCard from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/menu";
import { supabase } from "@/utils/supabase/client";

function MenuContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";
    const initialSearch = searchParams.get("search") || "";
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { totalItems, subtotal } = useCart();
    const searchInputRef = useRef(null);
    const shouldFocusSearch = searchParams.get("focus") === "search";

    useEffect(() => {
        if (shouldFocusSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [shouldFocusSearch]);

    useEffect(() => {
        async function fetchMenu() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('menu_items')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching menu items:", error);
                } else {
                    setMenuItems(data || []);
                }
            } catch (error) {
                console.error("Error fetching menu data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []);

    const filtered = menuItems.filter((item) => {
        const matchCategory = activeCategory === "all" || (item.categories && item.categories.includes(activeCategory));
        const matchSearch =
            !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCategory && matchSearch;
    });

    return (
        <div className="pb-nav">
            {/* Header — matches home page emerald for seamless transition */}
            <header className="sticky top-0 z-40 bg-emerald text-white px-5 pt-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="press-scale mt-1">
                            <span className="material-symbols-outlined text-white/70 text-[20px]">arrow_back</span>

                        </Link>
                        <h1 className="font-display text-xl leading-none tracking-tight">Menu</h1>
                    </div>
                    <div>
                        <span className="material-symbols-outlined text-emerald-light text-[20px] filled">eco</span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 material-symbols-outlined text-[18px]">
                        search
                    </span>
                    <input
                        ref={searchInputRef}
                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/15 text-white border-0 focus:ring-2 focus:ring-white/30 focus:bg-white/20 placeholder:text-white/50 text-sm font-medium transition-all outline-none"
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
                                ? "bg-white text-emerald shadow-sm"
                                : "bg-white/15 text-white/80 hover:bg-white/25"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* Menu Grid */}
            <main className="px-4 py-4 min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="w-10 h-10 border-4 border-emerald/30 border-t-emerald rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium text-gray-500">Loading fresh menu...</p>
                    </div>
                ) : (
                    <>
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
                            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                                <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3">search_off</span>
                                <p className="text-sm font-medium text-gray-500">No dishes found</p>
                                <p className="text-[11px] text-gray-400 mt-1">Try a different search or category</p>
                            </div>
                        )}
                    </>
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
