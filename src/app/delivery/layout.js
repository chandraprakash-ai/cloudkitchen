"use client";
import { AuthProvider } from "@/context/AuthContext";

export default function DeliveryLayout({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}
