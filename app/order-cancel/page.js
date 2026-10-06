"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, RefreshCw } from "lucide-react";

function OrderCancelContent() {
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get("invoice") || searchParams.get("invoice_id") || "N/A";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-xl w-full bg-white rounded-[32px] shadow-2xl shadow-orange-500/5 border border-gray-100 overflow-hidden text-center p-8 md:p-12 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                <div className="relative mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center relative">
                        <CreditCard className="w-12 h-12 text-orange-500" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">Payment Not Completed</h1>
                <p className="text-gray-500 text-base md:text-lg mb-8 max-w-md mx-auto">
                    Your order was created, but the payment was not completed. You can retry checkout or track the order with the invoice below.
                </p>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Invoice ID</p>
                    <span className="text-xl md:text-2xl font-mono font-bold text-black tracking-tighter">{invoiceId}</span>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href={`/track-order?invoice=${invoiceId}`}
                        className="w-full bg-black hover:bg-gray-800 text-white font-extrabold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-black/25 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <RefreshCw size={18} />
                        <span>Track This Order</span>
                    </Link>

                    <Link
                        href="/checkout"
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all duration-300 border border-gray-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <ArrowLeft size={18} />
                        <span>Back To Checkout</span>
                    </Link>
                </div>

                <p className="mt-8 text-xs text-gray-400 font-medium">If money was deducted, contact support with this invoice number.</p>
            </div>
        </div>
    );
}

export default function OrderCancelPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            }
        >
            <OrderCancelContent />
        </Suspense>
    );
}
