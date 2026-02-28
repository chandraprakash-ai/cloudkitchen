"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FoodCard from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/menu";
import { supabase } from "@/utils/supabase/client";
import ActiveOrderCard from "@/components/ActiveOrderCard";

export default function HomePage() {
    const router = useRouter();
    const { totalItems, subtotal } = useCart();

    const [popularItems, setPopularItems] = useState([]);
    const [featuredItems, setFeaturedItems] = useState([]);
    const [bestItems, setBestItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    useEffect(() => {
        async function fetchHomeData() {
            try {
                setLoading(true);

                const [popularRes, featuredRes, bestRes] = await Promise.all([
                    supabase
                        .from('menu_items')
                        .select('*')
                        .eq('is_popular', true)
                        .eq('in_stock', true)
                        .order('created_at', { ascending: false })
                        .limit(6),
                    supabase
                        .from('menu_items')
                        .select('*')
                        .eq('is_featured', true)
                        .eq('in_stock', true)
                        .order('created_at', { ascending: false })
                        .limit(6),
                    supabase
                        .from('menu_items')
                        .select('*')
                        .eq('in_stock', true)
                        .order('rating', { ascending: false })
                        .limit(4),
                ]);

                if (popularRes.data) setPopularItems(popularRes.data);
                if (featuredRes.data) setFeaturedItems(featuredRes.data);
                if (bestRes.data) setBestItems(bestRes.data);
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHomeData();
    }, []);

    return (
        <div className="pb-nav">
            {/* ── Header ── */}
            <header className="sticky top-0 z-40 bg-emerald text-white px-5 pt-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h1 className="font-display text-xl leading-none tracking-tight">Cloud Kitchen</h1>
                        <span className="material-symbols-outlined text-[13px] text-emerald-light filled">eco</span>
                    </div>
                    <Link
                        href="/cart"
                        className="relative p-2 rounded-xl hover:bg-white/15 text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-emerald badge-pulse">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Search — taps through to menu page */}
                <div
                    onClick={() => router.push('/menu?focus=search')}
                    className="relative flex items-center h-10 pl-9 pr-4 rounded-xl bg-white/15 cursor-pointer hover:bg-white/20 transition-colors"
                >
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 material-symbols-outlined text-[18px]">search</span>
                    <span className="text-sm text-white/50 font-medium">Search dishes...</span>
                </div>
            </header>

            <main className="px-4 py-5 space-y-6">
                {/* ── Active Order ── */}
                <ActiveOrderCard />

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

                {/* ── Featured Items (Horizontal Scroll) ── */}
                {featuredItems.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald text-[18px] filled">star</span>
                                <h3 className="text-[15px] font-bold text-emerald">Featured</h3>
                            </div>
                            <Link href="/menu" className="text-emerald-light text-[11px] font-semibold hover:underline">
                                See all
                            </Link>
                        </div>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 snap-x">
                            {featuredItems.map((item, i) => (
                                <div key={item.id} className="snap-start flex-none w-[160px]">
                                    <FoodCard item={item} index={i} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Popular Menu ── */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-saffron text-[18px] filled">local_fire_department</span>
                            <h3 className="text-[15px] font-bold text-emerald">Popular Right Now</h3>
                        </div>
                        <Link href="/menu" className="text-emerald-light text-[11px] font-semibold hover:underline">
                            See all
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-h-[150px]">
                        {loading ? (
                            <div className="col-span-2 flex flex-col items-center justify-center py-10 opacity-50">
                                <div className="w-8 h-8 border-4 border-emerald/30 border-t-emerald rounded-full animate-spin"></div>
                            </div>
                        ) : popularItems.length > 0 ? (
                            popularItems.map((item, i) => (
                                <FoodCard key={item.id} item={item} index={i} />
                            ))
                        ) : (
                            <div className="col-span-2 text-center text-sm text-gray-400 py-8">
                                No popular items available
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Our Best Items ── */}
                {bestItems.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald text-[18px] filled">workspace_premium</span>
                                <h3 className="text-[15px] font-bold text-emerald">Our Best</h3>
                            </div>
                            <Link href="/menu" className="text-emerald-light text-[11px] font-semibold hover:underline">
                                View all
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {bestItems.map((item, i) => (
                                <FoodCard key={item.id} item={item} index={i} />
                            ))}
                        </div>
                    </section>
                )}

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
