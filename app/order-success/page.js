import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Home, ShieldCheck, Truck } from "lucide-react";

export default async function OrderSuccessPage({ searchParams }) {
    const params = await searchParams;
    const invoiceId = params?.invoice?.trim() || "";

    return (
        <div className="bg-gray-50 min-h-screen font-[family-name:var(--font-outfit)]">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-1 bg-black" />

                    <div className="px-8 pt-10 pb-8 border-b border-gray-100">
                        <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center text-white mb-5">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>

                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Order Confirmed
                        </p>
                        <h1 className="text-3xl font-black text-gray-900">
                            Your order has been placed successfully.
                        </h1>
                        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                            We have received your order and started processing it. Keep your invoice number handy to track the status anytime.
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                                    <ClipboardList className="w-5 h-5 text-gray-700" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-3 mb-1">
                                    Invoice Number
                                </p>
                                <h2 className="text-2xl font-black text-gray-900 break-all">
                                    {invoiceId ? `#${invoiceId}` : "Will be available shortly"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    {invoiceId
                                        ? "Use this invoice number on the track order page to check delivery progress."
                                        : "Your order was placed, but the invoice number was not found in the redirect URL."}
                                </p>
                            </div>

                            <div className="bg-gray-900 rounded-lg p-6 text-white">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                                    What Happens Next
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-300">Your order details have been saved securely.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Truck className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-300">Delivery updates will appear on the tracking page as the order moves forward.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/"
                                className="bg-black text-white rounded-lg px-6 py-3 font-bold inline-flex items-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Back To Home
                            </Link>
                            <Link
                                href={invoiceId ? `/track-order?invoice=${encodeURIComponent(invoiceId)}` : "/track-order"}
                                className="border border-gray-200 rounded-lg px-6 py-3 font-bold text-gray-900 inline-flex items-center gap-2 hover:bg-gray-50 transition-colors bg-white"
                            >
                                Track Order
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
