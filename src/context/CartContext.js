"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("ck-cart");
            if (saved) setItems(JSON.parse(saved))
        } catch { }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("ck-cart", JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((item) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === id);
            if (existing && existing.quantity > 1) {
                return prev.map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                );
            }
            return prev.filter((i) => i.id !== id);
        });
    }, []);

    const deleteItem = useCallback((id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const getItemQuantity = useCallback(
        (id) => items.find((i) => i.id === id)?.quantity || 0,
        [items]
    );

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = subtotal > 0 ? (subtotal >= 499 ? 0 : 40) : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                setIsOpen,
                addItem,
                removeItem,
                deleteItem,
                clearCart,
                getItemQuantity,
                totalItems,
                subtotal,
                deliveryFee,
                tax,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
