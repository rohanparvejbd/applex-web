"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '../../context/WishlistContext';

export default function PremiumProductCard({ product, variant = 'default', showUsedTag = false, className = '' }) {
    const isCompact = variant === 'compact';
    const isDeal = variant === 'deal';
    const { isInWishlist, toggleWishlist } = useWishlist();

    const slug = product.name
        ? `${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`
        : String(product.id);

    // Price display
    const displayPrice = product.price || (product.retails_price ? `৳ ${Number(product.retails_price).toLocaleString('en-IN')}` : '');
    const displayOldPrice = product.oldPrice || null;

    const seedProductDetails = () => {
        if (typeof window === 'undefined' || !product?.id) return;
        try {
            sessionStorage.setItem(
                `applex_pdp_seed_${product.id}`,
                JSON.stringify({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice || null,
                    discount: product.discount || null,
                    imageUrl: product.imageUrl || product.image_path || product.image || '/no-image.svg',
                    brand: product.brand || product.rawSource?.brand_name || null,
                    rawPrice: product.rawPrice,
                    retails_price: product.retails_price || product.rawSource?.retails_price,
                    rawImeis: product.rawImeis || product.imeis || [],
                    category: product.category || product.rawSource?.category || null,
                    category_id: product.rawSource?.category_id,
                    category_name: product.rawSource?.category_name,
                    category_slug: product.rawSource?.category_slug,
                    sku: product.sku || product.rawSource?.sku || product.rawSource?.product_code || '',
                })
            );
        } catch {
            // ignore storage errors
        }
    };

    return (
        <Link
            href={`/product/${slug}`}
            onClick={seedProductDetails}
            className={`group relative flex flex-col overflow-hidden border border-gray-200 ${isDeal ? '' : 'bg-white'} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                isCompact ? 'h-[176px] rounded-lg' : isDeal ? 'h-full rounded-xl' : 'h-[260px] md:h-[280px] rounded-xl'
            } ${className}`}
        >
            <div className={`relative w-full bg-white ${isCompact ? 'h-[108px]' : isDeal ? 'aspect-[1/1]' : 'h-[200px] md:h-[220px]'}`}>
                <Image
                    src={(product.imageUrl || product.image_path || product.image || "/no-image.svg")?.toString().trim()}
                    alt={product.name || 'Product'}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    unoptimized
                />
                {showUsedTag && (
                    <Image
                        src="/used_tag.png"
                        alt="Used product"
                        width={80}
                        height={25}
                        className="absolute left-5 bottom-8 z-10 h-auto w-[64px] md:w-[80px]"
                    />
                )}
                {product.discount && !isCompact && (
                    <div className="absolute top-0 left-0 z-10 w-[52px] h-[24px] flex items-center justify-center text-[10px] font-semibold text-white" style={{background: '#111111', borderRadius: '10px 0 8px 0'}}>
                        {product.discount}
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 z-10 flex items-center justify-center rounded-full border border-gray-200/70 bg-white/90 backdrop-blur-sm transition-all duration-300 ${
                        isCompact ? 'h-6 w-6' : 'h-8 w-8'
                    } ${
                        isInWishlist(product.id)
                            ? 'text-red-500'
                            : 'text-[#9ca3af] opacity-0 group-hover:opacity-100 hover:text-red-500'
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isInWishlist(product.id) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={isInWishlist(product.id) ? 0 : 1.5}
                        className="w-[16px] h-[16px]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </button>
            </div>

            <div className={isCompact ? 'px-2 pb-2 pt-1' : 'px-3 md:px-4 pb-3 md:pb-4'}>
                <div className={`flex items-baseline gap-2 ${isCompact ? 'mt-0.5' : 'mt-1'}`}>
                    <span className={isCompact
                        ? 'font-bold text-[#0f172a] font-[family-name:var(--font-outfit)] text-[12px] leading-none tracking-normal'
                        : 'text-base font-bold text-[#0f172a] font-[family-name:var(--font-outfit)]'
                    }>
                        {isCompact ? displayPrice : displayPrice && (
                            <span className="inline-flex items-baseline">
                                <img src="/taka.svg" alt="৳" className="h-[13px] w-auto" />
                                <span className="text-[20px] font-bold font-[family-name:var(--font-outfit)]">{displayPrice.replace('৳', '').trim()}</span>
                            </span>
                        )}
                    </span>
                    {displayOldPrice && (
                        <span className={`text-[#71717A] line-through font-[family-name:var(--font-outfit)] ${
                            isCompact ? 'text-[10px] leading-none' : 'text-xs'
                        }`}>
                            {displayOldPrice}
                        </span>
                    )}
                </div>

                <h3 className={`overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] font-semibold text-[#0f172a] font-[family-name:var(--font-outfit)] ${
                    isCompact
                        ? 'h-[2.5em] text-[10px] leading-[1.25] tracking-normal'
                        : 'h-[2.4em] text-[14px] md:text-[15px] leading-[1.2] tracking-[-0.01em]'
                }`}>
                    {product.name}
                </h3>
            </div>
        </Link>
    );
}
