"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/utils/supabase/client";

export default function CartPage() {
    const { items, addItem, removeItem, deleteItem, clearCart, totalItems, subtotal, deliveryFee, tax, total } = useCart();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const displayId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

            // 1. Create order
            const { data: orderParams, error: orderError } = await supabase.from('orders').insert({
                display_id: displayId,
                customer_name: 'Guest Customer',
                status: 'new',
                total_amount: total
            }).select().single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItemsData = items.map(item => ({
                order_id: orderParams.id,
                menu_item_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
            if (itemsError) throw itemsError;

            // 3. Success
            clearCart();
            alert(`Order placed successfully! Your ID is ${displayId}`);
            router.push('/');
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="pb-nav">
                <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                    <Link href="/" className="p-1 -ml-1 press-scale">
                        <span className="material-symbols-outlined text-surface-dark text-[22px]">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-surface-dark">My Cart</h1>
                </header>
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-emerald text-[36px]">shopping_bag</span>
                    </div>
                    <h2 className="text-lg font-bold text-surface-dark mb-1">Your cart is empty</h2>
                    <p className="text-sm text-gray-500 mb-6">Looks like you haven't added any items yet</p>
                    <Link
                        href="/menu"
                        className="h-12 px-8 rounded-full bg-emerald text-white font-bold text-sm flex items-center gap-2 press-scale hover:bg-emerald-dark transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-nav">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="p-1 -ml-1 press-scale">
                        <span className="material-symbols-outlined text-surface-dark text-[22px]">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-surface-dark">My Cart</h1>
                </div>
                <button onClick={clearCart} className="text-red-500 text-[12px] font-semibold hover:underline press-scale">
                    Clear all
                </button>
            </header>

            <main className="px-4 py-4 space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl p-3 flex gap-3 animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
                            style={{ animationFillMode: "forwards" }}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 rounded-xl object-cover flex-none"
                                loading="lazy"
                            />
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <div className="veg-dot shrink-0" style={{ width: 12, height: 12 }}></div>
                                            <h4 className="text-sm font-semibold text-surface-dark truncate">{item.name}</h4>
                                        </div>
                                        <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                                    </div>
                                    <button onClick={() => deleteItem(item.id)} className="p-0.5 text-gray-400 hover:text-red-500 transition-colors press-scale shrink-0">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <span className="text-sm font-bold text-emerald-dark">₹{item.price * item.quantity}</span>
                                    <div className="flex items-center gap-0 bg-gray-100 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="h-7 w-7 flex items-center justify-center text-emerald hover:bg-gray-200 transition-colors press-scale"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">remove</span>
                                        </button>
                                        <span className="text-sm font-bold text-surface-dark min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => addItem(item)}
                                            className="h-7 w-7 flex items-center justify-center text-emerald hover:bg-gray-200 transition-colors press-scale"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Promo Code */}
                <div className="bg-white rounded-xl p-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald text-[20px]">confirmation_number</span>
                    <input
                        className="flex-1 h-8 bg-transparent text-sm font-medium text-surface-dark placeholder:text-gray-400 outline-none border-0"
                        placeholder="Have a promo code?"
                        type="text"
                    />
                    <button className="px-4 py-1.5 rounded-full border-2 border-emerald text-emerald text-[11px] font-bold uppercase tracking-wide hover:bg-emerald hover:text-white transition-colors press-scale">
                        Apply
                    </button>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-surface-dark">Payment Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-surface-dark">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500">Delivery Fee</span>
                            <span className="font-medium text-surface-dark">
                                {deliveryFee === 0 ? (
                                    <span className="text-emerald-light">FREE</span>
                                ) : (
                                    `₹${deliveryFee}`
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-gray-500">Tax (5%)</span>
                            <span className="font-medium text-surface-dark">₹{tax}</span>
                        </div>
                        {subtotal > 0 && subtotal < 499 && (
                            <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-2.5 mt-1">
                                <span className="material-symbols-outlined text-emerald text-[16px]">local_shipping</span>
                                <span className="text-[11px] text-emerald-dark font-medium">
                                    Add ₹{499 - subtotal} more for free delivery
                                </span>
                            </div>
                        )}
                        <div className="border-t border-gray-100 pt-2 flex justify-between">
                            <span className="text-[15px] font-bold text-surface-dark">Total</span>
                            <span className="text-[15px] font-bold text-emerald-dark">₹{total}</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Checkout Button */}
            <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[calc(var(--max-w,448px)-32px)] z-40">
                <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full bg-emerald text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-xl shadow-emerald/25 ${isCheckingOut ? 'opacity-80 cursor-wait' : 'press-scale hover:bg-emerald-dark transition-colors'}`}
                >
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">Total to pay</span>
                        <span className="text-lg font-bold">₹{total}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-5 py-2.5">
                        <span className="text-sm font-bold">{isCheckingOut ? 'Processing...' : 'Place Order'}</span>
                        {!isCheckingOut && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                    </div>
                </button>
            </div>
        </div>
    );
}
