"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { clearPendingPurchase, readPendingPurchase } from "../../../lib/paymentUtils";

export default function PaymentSuccessPage() {
    const params = useParams();
    const { clearCart } = useCart();
    const invoiceId =
        (typeof params.invoiceId === "string" ? params.invoiceId : params.invoiceId?.[0]) || "N/A";

    useEffect(() => {
        clearCart();
        readPendingPurchase();
        clearPendingPurchase();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-xl w-full bg-white rounded-[32px] shadow-2xl shadow-purple-500/5 border border-gray-100 overflow-hidden text-center p-8 md:p-12 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                <div className="relative mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center relative">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                        <div className="absolute inset-0 rounded-full border-4 border-green-100 animate-ping opacity-25" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    Payment Successful
                </h1>
                <p className="text-gray-500 text-base md:text-lg mb-8 max-w-sm mx-auto">
                    Thank you! Your payment was received and your order is confirmed.
                </p>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                        Invoice ID
                    </p>
                    <span className="text-xl md:text-2xl font-mono font-bold text-black tracking-tighter">
                        {invoiceId}
                    </span>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-black font-bold">
                        <Truck size={14} />
                        <span>Ready for tracking</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href={`/track-order?invoice=${encodeURIComponent(invoiceId)}`}
                        className="w-full bg-black hover:bg-gray-800 text-white font-extrabold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-black/25 flex items-center justify-center gap-3 active:scale-[0.98] group"
                    >
                        <span>Track Your Order</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/"
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all duration-300 border border-gray-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <ShoppingBag size={18} />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                <p className="mt-8 text-xs text-gray-400 font-medium">
                    Keep this invoice number for tracking and support.
                </p>
            </div>
        </div>
    );
}
