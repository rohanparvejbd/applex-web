"use client";

import { useCart } from "../../context/CartContext";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-[family-name:var(--font-outfit)]">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 border border-gray-200 rounded-lg bg-white">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                        <FiShoppingBag size={40} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h2>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/">
                        <button className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Cart Items */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${item.variantKey}-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                                <button
                                    onClick={() => removeFromCart(item.id, item.variantKey)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1"
                                >
                                    <FiTrash2 size={18} />
                                </button>

                                <div className="flex gap-4 pr-8">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative flex items-center justify-center">
                                        {item.isCareplan ? (
                                            <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center">
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

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.variantKey, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-l-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                                            disabled={item.quantity <= 1}
                                        >
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.variantKey, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-r-lg transition-all"
                                        >
                                            <FiPlus size={14} />
                                        </button>
                                    </div>

                                    <div className="font-bold text-gray-900">
                                        ৳{(item.numericPrice * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600 gap-4">
                                    <span className="shrink-0">Subtotal</span>
                                    <span className="font-medium text-gray-900 text-right">৳{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 gap-4">
                                    <span className="shrink-0">Shipping</span>
                                    <span className="font-medium text-gray-900 text-right">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-gray-600 gap-4">
                                    <span className="shrink-0">Tax</span>
                                    <span className="font-medium text-gray-900 text-right">Included</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-gray-900">৳{cartTotal.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout">
                                <button className="w-full bg-black text-white rounded-lg py-3 font-bold hover:bg-gray-800 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
