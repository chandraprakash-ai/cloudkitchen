"use client";
import Link from "next/link";
import { useState } from "react";
import FoodCard from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";
import { categories, menuItems } from "@/data/menu";

export default function HomePage() {
    const { totalItems, subtotal } = useCart();
    const [searchFocused, setSearchFocused] = useState(false);
    const popularItems = menuItems.filter((i) => i.isPopular);

    return (
        <div className="pb-nav">
            {/* ── Header ── */}
            <header className="sticky top-0 z-40 bg-emerald text-white px-5 pt-5 pb-6 rounded-b-[24px] shadow-none">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium text-emerald-light/80 uppercase tracking-[0.12em] mb-0.5">
                            Delivering to
                        </span>
                        <div className="flex items-center gap-1 cursor-pointer group">
                            <span className="font-bold text-lg leading-none tracking-tight">Home • 123 Green Way</span>
                            <span className="material-symbols-outlined text-emerald-light text-lg group-hover:rotate-180 transition-transform duration-300">
                                expand_more
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm press-scale">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <Link
                            href="/cart"
                            className="relative p-2 rounded-full bg-white text-emerald shadow-none hover:bg-gray-100 transition-colors press-scale"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-emerald badge-pulse">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">
                        search
                    </span>
                    <input
                        className="w-full h-11 pl-10 pr-11 rounded-xl bg-white text-surface-dark border-0 shadow-none focus:ring-2 focus:ring-emerald-light/50 placeholder:text-gray-400 text-sm font-medium transition-all outline-none"
                        placeholder="Search for fresh greens..."
                        type="text"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <button className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-emerald hover:bg-emerald/10 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                    </button>
                </div>
            </header>

            <main className="px-4 py-5 space-y-6">
                {/* ── Categories ── */}
                <section className="animate-fade-in">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[15px] font-bold text-emerald">Categories</h3>
                        <Link href="/menu" className="text-emerald-light text-[11px] font-semibold hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1 snap-x">
                        {categories.filter(c => c.id !== "all").map((cat, i) => (
                            <Link
                                key={cat.id}
                                href={`/menu?category=${cat.id}`}
                                className={`snap-start flex-none flex flex-col items-center gap-2 group cursor-pointer animate-scale-in opacity-0 stagger-${i + 1}`}
                                style={{ animationFillMode: "forwards" }}
                            >
                                <div className="w-[60px] h-[60px] rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                                    {cat.image ? (
                                        <img alt={cat.name} className="w-full h-full object-cover" src={cat.image} loading="lazy" />
                                    ) : (
                                        <span className="material-symbols-outlined text-emerald text-2xl">{cat.icon}</span>
                                    )}
                                </div>
                                <span className="text-[11px] font-medium text-surface-dark group-hover:text-emerald transition-colors">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── Hero Banner ── */}
                <section className="relative rounded-2xl overflow-hidden group animate-slide-up opacity-0" style={{ animationFillMode: "forwards", animationDelay: "0.1s" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark/90 via-emerald-dark/20 to-transparent z-10"></div>
                    <img
                        alt="Delicious clay pot biryani"
                        className="w-full h-[200px] object-cover transition-transform duration-700 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCiWLCeNWPOp4CsL8NGcM5WqVvqEGVILI8hxRFhGSQ0OWszWInLgiMrwvDSzPj1Q8Zb8-FfPOgBwkFKFhpTaIb04HnIYqZF74cgtQQUVl5zVgGM4erz0fbG763wcQDwMQlmsPTO2CMLojUSd4OUYEV-r85Y9uY9CHSmDlpw_KctqHcF_oQwhbD7BgvQpwWH4pNKgS-iCTeiEpmyfEOv0pZnYe4sg9HldOWSewcXiF9suuW990Nnqcv4YE6BpxwGD3vAGUfBT8_D3z2"
                    />
                    <div className="absolute top-3 left-3 z-20">
                        <div className="bg-emerald/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">eco</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.1em]">100% Pure Veg</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex justify-between items-end">
                        <div className="flex-1 mr-4">
                            <span className="inline-block px-2 py-0.5 mb-1.5 rounded-md bg-white/15 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.1em] uppercase border border-white/10">
                                Trending
                            </span>
                            <h2 className="font-display text-2xl text-white leading-tight mb-0.5">Clay Pot Biryani</h2>
                            <p className="text-gray-200 text-[11px] line-clamp-1">Slow-cooked with aromatic spices & fresh veggies</p>
                        </div>
                        <Link
                            href="/menu?category=biryani"
                            className="bg-white text-emerald h-10 w-10 rounded-full flex items-center justify-center shadow-lg press-scale"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </Link>
                    </div>
                </section>

                {/* ── Popular Menu ── */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[15px] font-bold text-emerald">Popular Right Now</h3>
                        <Link href="/menu" className="text-emerald-light text-[11px] font-semibold hover:underline">
                            See all
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {popularItems.slice(0, 6).map((item, i) => (
                            <FoodCard key={item.id} item={item} index={i} />
                        ))}
                    </div>
                </section>

                {/* ── Why Choose Us ── */}
                <section className="animate-fade-in">
                    <h3 className="text-[15px] font-bold text-emerald mb-3 px-1">Why Cloud Kitchen?</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { icon: "eco", label: "100% Veg", sub: "Pure vegetarian" },
                            { icon: "local_fire_department", label: "Fresh", sub: "Made to order" },
                            { icon: "schedule", label: "30 min", sub: "Fast delivery" },
                        ].map((item) => (
                            <div
                                key={item.icon}
                                className="bg-emerald-50 rounded-xl p-3 flex flex-col items-center text-center gap-1.5"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald text-[20px]">{item.icon}</span>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-dark">{item.label}</span>
                                <span className="text-[9px] text-gray-500">{item.sub}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* ── Floating Cart Bar ── */}
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
