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
        <div className="py-2">
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
                                <div className={`absolute top-8 bottom-0 left-[15px] w-0.5 -ml-px transition-colors duration-500 ${isCompleted ? 'bg-[#ff8a00]' : 'bg-gray-100'}`} />
                            )}
                            
                            {/* Node */}
                            <div className="relative flex-shrink-0">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 z-10 relative ${
                                    isCompleted ? "bg-[#ff8a00] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-400 group-hover:border-gray-300"
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StageIcon className="w-3.5 h-3.5" />}
                                </div>
                                {isCurrent && (
                                    <div className="absolute inset-0 rounded-md border border-[#ff8a00] scale-[1.3] opacity-50 z-0 animate-pulse" />
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex flex-col pt-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-sm tracking-tight ${isCurrent ? "font-bold text-[#ff8a00]" : isCompleted ? "font-semibold text-gray-900" : "font-medium text-gray-400"}`}>
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
    const getStatusColor = (s) => { s = Number(s); if (s === 1) return "bg-gray-100 text-gray-700 border-gray-200"; if (s === 2) return "bg-blue-50 text-blue-700 border-blue-200"; if (s === 3) return "bg-[#fff3e5] text-[#ff8a00] border-[#ff8a00]/30"; if (s === 4) return "bg-green-50 text-green-700 border-green-200"; if (s === 5) return "bg-red-50 text-red-700 border-red-200"; if (s === 6) return "bg-yellow-50 text-yellow-700 border-yellow-200"; return "bg-gray-100 text-gray-800"; };

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
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bg-pattern {
                    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>

            {/* Rich Header */}
            <div className="bg-[#0a0a0a] border-b border-[#222] pt-12 pb-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <SearchCode className="w-6 h-6 text-[#ff8a00]" />
                            Order Tracking
                        </h1>
                        <p className="text-sm text-gray-400 mt-1 font-medium">Monitor your shipments in real-time.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
                {/* Search Bar - High Contrast */}
                <div className="bg-white rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                placeholder="Enter Invoice ID (e.g. INV-12345)"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff8a00] focus:border-[#ff8a00] transition-colors text-sm font-semibold placeholder-gray-400 shadow-inner"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-[#ff8a00] text-white font-bold text-sm rounded-md hover:bg-[#e67a00] hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center shrink-0"
                        >
                            {loading ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : "Track Package"}
                        </button>
                    </form>
                </div>

                {/* Results - Dashboard Style */}
                {orderData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        
                        {/* Left Column: Status & Timeline */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden relative">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff8a00]" />
                                <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                                    <div className="flex items-center justify-between">
                                        <div className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusColor(orderData.tran_status || orderData.status)} shadow-sm`}>
                                            {getStatusLabel(orderData.tran_status || orderData.status)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
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
                            
                            <div className="bg-white rounded-md shadow-sm border border-gray-200 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800" />
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-b from-gray-50/80 to-white">
                                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        Order Summary
                                    </h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Invoice ID</span>
                                        <span className="text-sm font-bold text-[#ff8a00]">#{orderData.invoice_id}</span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-5 bg-white">
                                    {orderData.sales_details?.length > 0 && (
                                        <div className="space-y-4">
                                            {orderData.sales_details.map((item, i) => (
                                                <div key={i} className="flex gap-4 items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0 group">
                                                    <div className="h-14 w-14 flex-shrink-0 bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden relative group-hover:border-[#ff8a00]/30 transition-colors">
                                                        {item.product_info?.image_path ? (
                                                            <Image src={item.product_info.image_path} alt="Product" fill className="object-cover" unoptimized />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-300"><Package size={16} /></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate group-hover:text-[#ff8a00] transition-colors">{item.product_info?.name || "Product"}</p>
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
                                {/* Shipping Info */}
                                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-[#ff8a00] transition-colors" />
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

                                {/* Summary */}
                                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5 bg-gradient-to-br from-white to-gray-50/50">
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
                                            <div className="flex justify-between text-[#ff8a00] bg-[#fff3e5] px-2 py-1 -mx-2 rounded-md">
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

                {/* Empty State */}
                {searched && !loading && !orderData && (
                    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-12 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-red-50 border border-red-100 mb-4 text-red-500">
                            <SearchCode className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Order Found</h3>
                        <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">We couldn't locate an order with that ID. Please check your email for the correct Invoice ID.</p>
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
