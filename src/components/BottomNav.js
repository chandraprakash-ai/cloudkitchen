"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navItems = [
    { href: "/", icon: "home", activeIcon: "home", label: "Home" },
    { href: "/menu", icon: "restaurant_menu", activeIcon: "restaurant_menu", label: "Menu" },
    { href: "/orders", icon: "receipt_long", activeIcon: "receipt_long", label: "Orders" },
    { href: "/cart", icon: "shopping_bag", activeIcon: "shopping_bag", label: "Cart" },
    { href: "/profile", icon: "person", activeIcon: "person", label: "Profile" },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems } = useCart();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100/60 pb-safe">
            <div className="flex justify-around items-center h-[64px] max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors press-scale ${isActive
                                ? "text-emerald"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[24px] ${isActive ? "filled" : ""}`}>
                                {isActive ? item.activeIcon : item.icon}
                            </span>
                            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                                {item.label}
                            </span>
                            {item.href === "/cart" && totalItems > 0 && (
                                <span className="absolute -top-0.5 right-1/2 translate-x-4 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center badge-pulse">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
