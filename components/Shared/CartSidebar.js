"use client";

import { useCart } from "../../context/CartContext";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSidebar() {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        cartTotal
    } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end font-[family-name:var(--font-outfit)]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            ></div>

            {/* Sidebar content */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                            <FiShoppingBag size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900">Your Cart ({cartItems.length})</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Cart Items / Empty State */}
                <div className="flex-1 overflow-y-auto p-5">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-2">
                                <FiShoppingBag size={48} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                            <p className="text-sm text-gray-500 max-w-[250px]">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={closeCart}
                                className="mt-4 px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${item.variantKey}-${index}`} className="bg-white rounded-lg p-4 border border-gray-200">

                                    <div className="flex gap-3">
                                        {/* Image */}
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative flex items-center justify-center">
                                            {item.isCareplan ? (
                                                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            ) : (
                                                <Image
                                                    src={
                                                        (item.imageUrl ||
                                                        item.images?.[0] ||
                                                        item.image ||
                                                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400")?.toString().trim()
                                                    }
                                                    alt={item.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Name + Variants */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>

                                            {item.variants && (
                                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                    {item.variants.storage && (
                                                        <span className="border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500">{item.variants.storage}</span>
                                                    )}
                                                    {item.variants.colors?.name && (
                                                        <span className="border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500 flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.variants.colors.hex }}></span>
                                                            {item.variants.colors.name}
                                                        </span>
                                                    )}
                                                    {item.variants.region && (
                                                        <span className="border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500">{item.variants.region}</span>
                                                    )}
                                                    {item.variants.battery && (
                                                        <span className="border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500">Battery: {item.variants.battery}</span>
                                                    )}
                                                    {item.variants.box && (
                                                        <span className="border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500">Box: {item.variants.box}</span>
                                                    )}
                                                    {item.isCare && (
                                                        <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">Applex Care</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price / Quantity / Delete row */}
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="font-bold text-black text-sm">
                                            ৳{(item.numericPrice * item.quantity).toLocaleString()}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Qty Controls */}
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.variantKey, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-l-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FiMinus size={12} />
                                                </button>
                                                <span className="w-7 text-center text-xs font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.variantKey, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-r-lg transition-all"
                                                >
                                                    <FiPlus size={12} />
                                                </button>
                                            </div>

                                            {/* Delete */}
                                            <button
                                                onClick={() => removeFromCart(item.id, item.variantKey)}
                                                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {cartItems.length > 0 && (
                    <div className="pt-5 pb-24 md:pb-5 px-5 bg-white border-t border-gray-200 z-10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 font-medium">Subtotal</span>
                            <span className="text-xl font-extrabold text-gray-900">৳{cartTotal.toLocaleString()}</span>
                        </div>

                        <p className="text-xs text-gray-400 mb-5 text-center">Shipping & taxes calculated at checkout</p>

                        <div className="flex items-center gap-3">
                            <Link href="/cart" onClick={closeCart} className="flex-1">
                                <button className="w-full py-3.5 px-4 border border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-all">
                                    View Cart
                                </button>
                            </Link>
                            <Link href="/checkout" onClick={closeCart} className="flex-1">
                                <button className="w-full py-3.5 px-4 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-all">
                                    Checkout Now
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide In Animation CSS */}
            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
