"use client";

import { Suspense, useEffect, useState } from "react";
import { trackOrder } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Home, Package, Truck, PackageCheck, ClipboardList, CheckCircle2, Search, MapPin, SearchCode, Clock, User, Phone } from "lucide-react";

const timelineStages = [
    { id: 1, label: "Order Received", desc: "Order placed successfully", icon: ClipboardList },
    { id: 2, label: "Confirmed", desc: "Verified by our team", icon: PackageCheck },
    { id: 3, label: "Processing", desc: "On the way to you", icon: Truck },
    { id: 4, label: "Delivered", desc: "Successfully delivered", icon: Home },
];

const OrderTimeline = ({ currentStatus }) => {
    const status = Number(currentStatus);
    return (
        <div className="py-2 font-[family-name:var(--font-outfit)]">
            <div className="relative">
                {timelineStages.map((stage, index) => {
                    const isCompleted = status >= stage.id;
                    const isCurrent = status === stage.id;
                    const StageIcon = stage.icon;
                    const isLast = index === timelineStages.length - 1;
                    
                    return (
                        <div key={stage.id} className="relative flex gap-4 pb-6 last:pb-0 group">
                            {/* Line connecting nodes */}
                            {!isLast && (
                                <div className={`absolute top-8 bottom-0 left-[15px] w-0.5 -ml-px transition-colors duration-500 ${isCompleted ? 'bg-gray-900' : 'bg-gray-100'}`} />
                            )}
                            
                            {/* Node */}
                            <div className="relative flex-shrink-0">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 z-10 relative ${
                                    isCompleted ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-400 group-hover:border-gray-300"
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StageIcon className="w-3.5 h-3.5" />}
                                </div>
                                {isCurrent && (
                                    <div className="absolute inset-0 rounded-md border border-gray-900 scale-[1.3] opacity-50 z-0 animate-pulse" />
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex flex-col pt-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-sm tracking-tight ${isCurrent ? "font-bold text-gray-900" : isCompleted ? "font-semibold text-gray-900" : "font-medium text-gray-400"}`}>
                                        {stage.label}
                                    </h4>
                                </div>
                                <p className={`text-[12px] mt-0.5 ${isCurrent ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                                    {stage.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [invoiceId, setInvoiceId] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const getStatusLabel = (s) => { s = Number(s); if (s === 1) return "Order Received"; if (s === 2) return "Confirmed"; if (s === 3) return "Processing"; if (s === 4) return "Delivered"; if (s === 5) return "Canceled"; if (s === 6) return "On Hold"; return "Pending"; };
    const getStatusColor = (s) => { s = Number(s); if (s === 1) return "bg-gray-100 text-gray-700 border-gray-200"; if (s === 2) return "bg-blue-50 text-blue-700 border-blue-200"; if (s === 3) return "bg-[#fff3e5] text-gray-900 border-gray-300"; if (s === 4) return "bg-green-50 text-green-700 border-green-200"; if (s === 5) return "bg-red-50 text-red-700 border-red-200"; if (s === 6) return "bg-yellow-50 text-yellow-700 border-yellow-200"; return "bg-gray-100 text-gray-800"; };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!invoiceId.trim()) { toast.error("Please enter an Invoice ID"); return; }
        setLoading(true);
        setOrderData(null);
        setSearched(true);
        try {
            const response = await trackOrder({ invoice_id: invoiceId.trim() });
            if (response.success && response.data?.data?.length > 0) {
                setOrderData(response.data.data[0]);
                toast.success("Order tracked successfully.");
            } else {
                toast.error("Order not found.");
            }
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const invoiceFromUrl = searchParams.get("invoice")?.trim();
        if (invoiceFromUrl) {
            setInvoiceId(invoiceFromUrl);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-white pb-20 font-[family-name:var(--font-outfit)] relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <Image
                    src="/svg/order traking.svg"
                    alt=""
                    width={900}
                    height={700}
                    className="object-contain opacity-[0.05]"
                />
            </div>
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Hero Header */}
            <div className="bg-white relative z-10 overflow-hidden pt-16 pb-20">
                <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 border-0 text-sm font-semibold px-4 py-2 rounded-full shadow-sm mb-6 font-[family-name:var(--font-outfit)]">
                        <Package className="w-4 h-4" />
                        Track Your Order
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 font-[family-name:var(--font-outfit)]">
                        <span className="text-gray-900">Order </span>
                        <span className="text-gray-900">Tracking</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-700 text-lg font-medium mb-0 font-[family-name:var(--font-outfit)]">
                        Enter your Invoice ID to track your package in real-time.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
                {/* Search Box */}
                <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm mb-8 focus-within:border-gray-900 transition-colors duration-200">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                placeholder="Enter your Invoice ID (e.g., INV-2025-12-14-75889)"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border-0 focus:outline-none text-sm font-medium text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3.5 bg-gray-900 text-white font-bold text-sm rounded-md hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap font-[family-name:var(--font-outfit)]"
                        >
                            {loading ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <>Track Order <span className="text-base">→</span></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Empty / Initial State */}
                {!searched && !orderData && (
                    <div className="text-center py-12 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 border border-gray-200 mb-5">
                            <Package className="w-5 h-5 text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Invoice ID</h3>
                        <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                            You can find your Invoice ID in the confirmation message or invoice we sent you.
                        </p>
                    </div>
                )}

                {/* Results */}
                {orderData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* Left Column: Status & Timeline */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-md border border-gray-200 overflow-hidden relative">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900" />
                                <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                                    <div className="flex items-center justify-between">
                                        <div className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusColor(orderData.tran_status || orderData.status)}`}>
                                            {getStatusLabel(orderData.tran_status || orderData.status)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-sm">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{new Date(orderData.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {![5, 6].includes(Number(orderData.tran_status || orderData.status)) && (
                                    <div className="p-5 bg-white">
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-5">Journey</h3>
                                        <OrderTimeline currentStatus={orderData.tran_status || orderData.status} />
                                    </div>
                                )}

                                {[5, 6].includes(Number(orderData.tran_status || orderData.status)) && (
                                    <div className="p-5">
                                        <div className={`p-4 rounded-md border shadow-sm ${Number(orderData.tran_status || orderData.status) === 5 ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
                                            <h3 className={`text-sm font-bold flex items-center gap-2 ${Number(orderData.tran_status || orderData.status) === 5 ? "text-red-700" : "text-yellow-700"}`}>
                                                {Number(orderData.tran_status || orderData.status) === 5 ? "Order Canceled" : "Order On Hold"}
                                            </h3>
                                            <p className={`text-xs mt-2 font-medium ${Number(orderData.tran_status || orderData.status) === 5 ? "text-red-600" : "text-yellow-600"}`}>
                                                {Number(orderData.tran_status || orderData.status) === 5 ? "This order has been canceled and will not proceed." : "This order is on hold. Please check your email for details."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-b from-gray-50/80 to-white">
                                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        Order Summary
                                    </h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Invoice ID</span>
                                        <span className="text-sm font-bold text-gray-900">#{orderData.invoice_id}</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-white">
                                    {orderData.sales_details?.length > 0 && (
                                        <div className="space-y-4">
                                            {orderData.sales_details.map((item, i) => (
                                                <div key={i} className="flex gap-4 items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0 group">
                                                    <div className="h-14 w-14 flex-shrink-0 bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden relative group-hover:border-gray-400 transition-colors">
                                                        {item.product_info?.image_path ? (
                                                            <Image src={item.product_info.image_path} alt="Product" fill className="object-cover" unoptimized />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-300"><Package size={16} /></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate group-hover:text-gray-700 transition-colors">{item.product_info?.name || "Product"}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <p className="text-[12px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Qty: {item.qty}</p>
                                                            {item.size && <p className="text-[12px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Size: {item.size}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-bold text-gray-900 text-sm">৳{(item.price * item.qty).toLocaleString()}</p>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">৳{item.price} each</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-md border border-gray-200 p-5 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-gray-900 transition-colors" />
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">Delivery Details</h3>
                                    <div className="space-y-4 pl-2">
                                        <div className="flex items-start gap-3">
                                            <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-semibold text-gray-400">Recipient</p>
                                                <p className="font-bold text-gray-900 text-sm">{orderData.delivery_customer_name || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-semibold text-gray-400">Contact</p>
                                                <p className="font-bold text-gray-900 text-sm">{orderData.delivery_customer_phone || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-semibold text-gray-400">Address</p>
                                                <p className="font-semibold text-gray-800 text-sm leading-relaxed max-w-[200px]">{orderData.delivery_customer_address || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-md border border-gray-200 p-5">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Summary</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-medium">Subtotal</span>
                                            <span className="font-bold text-gray-900">৳{(orderData.sub_total || orderData.total || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-medium">Shipping</span>
                                            <span className="font-bold text-gray-900">৳{(orderData.delivery_fee || 0).toLocaleString()}</span>
                                        </div>
                                        {Number(orderData.coupon_discount || 0) > 0 && (
                                            <div className="flex justify-between text-gray-900 bg-gray-50 px-2 py-1 -mx-2 rounded-md">
                                                <span className="font-semibold">Discount</span>
                                                <span className="font-bold">-৳{orderData.coupon_discount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-3 mt-1 border-t border-gray-200">
                                            <span className="font-bold text-gray-500 uppercase tracking-wider text-[11px] pt-1">Total Amount</span>
                                            <span className="font-black text-gray-900 text-lg">৳{(Number(orderData.sub_total ?? orderData.total ?? 0) + Number(orderData.delivery_fee ?? 0) - Number(orderData.coupon_discount ?? 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Not Found State */}
                {searched && !loading && !orderData && (
                    <div className="bg-white rounded-md border border-gray-200 p-12 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-100 mb-4 text-red-500">
                            <SearchCode className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Order Found</h3>
                        <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">We couldn&apos;t locate an order with that ID. Please check your email for the correct Invoice ID.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <TrackOrderContent />
        </Suspense>
    );
}
