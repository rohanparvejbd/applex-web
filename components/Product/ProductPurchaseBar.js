'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

function buildPricingStats(product, currentPriceNumber) {
    const offerPrice = Math.max(0, Math.round(currentPriceNumber));
    const regularPriceFromData = Number(product?.originalPrice || 0);
    const regularPrice =
        regularPriceFromData > offerPrice ? regularPriceFromData : Math.round(offerPrice * 1.1);

    const catBlob = `${product?.category?.name || ''} ${product?.category?.slug || ''}`.toLowerCase();
    const isPhoneCategory = (() => {
        if (!catBlob.trim()) return false;
        if (catBlob.includes('headphone') || catBlob.includes('earphone') || catBlob.includes('airpods')) {
            return false;
        }
        if (catBlob.includes('iphone')) return true;
        if (catBlob.includes('smartphone') || catBlob.includes('smart phone')) return true;
        if (catBlob.includes('mobile')) return true;
        if (/\bphones?\b/.test(catBlob)) return true;
        return false;
    })();

    let minBooking = Math.max(1000, Math.floor((offerPrice * 0.12) / 500) * 500);
    let purchasePoints = Math.max(10, Math.floor((offerPrice / 1200) / 10) * 10);
    if (isPhoneCategory) {
        minBooking = 10000;
        purchasePoints = 15;
    }

    const emiMonthly = Math.max(1, Math.round(regularPrice / 12));

    return { offerPrice, regularPrice, minBooking, purchasePoints, emiMonthly };
}

export default function ProductPurchaseBar({
    product,
    variantSelection,
    selectedCarePlans = [],
    displayPrice,
    showSummary = false,
    className = '',
}) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedPricingMode] = useState('offer');

    const currentPriceNumber =
        variantSelection?.currentPriceNumber ?? (Number(product?.rawPrice) || 0);
    const getCartPayloadAndVariants = variantSelection?.getCartPayloadAndVariants;

    useEffect(() => {
        setQuantity(1);
    }, [product?.id]);

    const pricingStats = useMemo(
        () => buildPricingStats(product, currentPriceNumber),
        [product, currentPriceNumber]
    );

    const handleAddToCart = () => {
        if (!getCartPayloadAndVariants) return;
        const { cartProduct, cartVariants } = getCartPayloadAndVariants({
            quantity,
            selectedCarePlans: [],
            selectedPricingMode,
            pricingStats,
        });
        addToCart(cartProduct, quantity, cartVariants);
        selectedCarePlans.forEach((plan) => {
            if (Number(plan.price) > 0) {
                addToCart({
                    id: `careplan_${plan.id}_${cartProduct.id}`,
                    name: `${plan.name} - ${cartProduct.name}`,
                    price: `৳${Number(plan.price).toLocaleString()}`,
                    rawPrice: Number(plan.price),
                    imageUrl: '/no-image.svg',
                    isCareplan: true,
                }, 1, null, false);
            }
        });
    };

    const handleBuyNow = () => {
        if (!getCartPayloadAndVariants) return;
        const { cartProduct, cartVariants } = getCartPayloadAndVariants({
            quantity,
            selectedCarePlans: [],
            selectedPricingMode,
            pricingStats,
        });
        addToCart(cartProduct, quantity, cartVariants, false);
        selectedCarePlans.forEach((plan) => {
            if (Number(plan.price) > 0) {
                addToCart({
                    id: `careplan_${plan.id}_${cartProduct.id}`,
                    name: `${plan.name} - ${cartProduct.name}`,
                    price: `৳${Number(plan.price).toLocaleString()}`,
                    rawPrice: Number(plan.price),
                    imageUrl: '/no-image.svg',
                    isCareplan: true,
                }, 1, null, false);
            }
        });
        router.push('/checkout');
    };

    return (
        <div className={className}>
            {showSummary && displayPrice && (
                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 mb-0.5">
                            Your total
                        </p>
                        <p className="text-xs text-gray-600">Based on options selected above</p>
                    </div>
                    <p
                        className="text-xl md:text-2xl font-black text-[#ff8a00]"
                        style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                    >
                        {displayPrice}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex items-center justify-between border border-gray-200 rounded-lg py-1 px-1 w-full sm:w-[120px] shrink-0 bg-[#f5f5f5]">
                    <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="cursor-pointer w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#ff8a00] hover:bg-white rounded-md transition-all"
                        aria-label="Decrease quantity"
                    >
                        <FiMinus size={16} />
                    </button>
                    <span className="font-black text-gray-900 w-8 text-center text-sm">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="cursor-pointer w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#ff8a00] hover:bg-white rounded-md transition-all"
                        aria-label="Increase quantity"
                    >
                        <FiPlus size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="cursor-pointer flex-1 bg-white border border-gray-900 text-gray-900 font-bold py-3.5 md:py-4 px-3 rounded-lg hover:bg-gray-50 transition-all text-[13px] tracking-tight inline-flex items-center justify-center gap-2 font-[family-name:var(--font-outfit)]"
                >
                    <Image
                        src="/product-details-svg/add%20to%20crat.svg"
                        alt=""
                        width={18}
                        height={18}
                        className="w-[18px] h-[18px] object-contain"
                    />
                    Add to Cart
                </button>

                <button
                    type="button"
                    onClick={handleBuyNow}
                    className="cursor-pointer flex-1 sm:flex-[1.4] bg-black text-white font-bold py-3.5 md:py-4 px-2 rounded-lg hover:bg-gray-900 transition-all text-[13px] tracking-tight font-[family-name:var(--font-outfit)]"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}
