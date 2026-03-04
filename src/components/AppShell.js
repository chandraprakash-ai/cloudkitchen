"use client";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import BottomNav from "@/components/BottomNav";

export default function AppShell({ children }) {
    return (
        <AuthProvider>
            <CartProvider>
                <div className="max-w-md mx-auto min-h-dvh relative bg-white shadow-[0_0_60px_rgba(0,0,0,0.08)]">
                    {children}
                    <BottomNav />
                </div>
            </CartProvider>
        </AuthProvider>
    );
}
