"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ProductCard from '../Shared/PremiumProductCard';
import ServiceHighlightsStrip from '../ServiceHighlights/ServiceHighlightsStrip';

function FlashSaleCountdown() {
    const [parts, setParts] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            const diff = Math.max(0, end.getTime() - now.getTime());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setParts({ h, m, s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 md:text-xs">
                Ending Soon
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
                <span className="flex min-w-[2.5rem] items-center justify-center rounded-md bg-[#991b1b] px-2 py-1.5 text-[14px] font-black tabular-nums text-white shadow-inner md:min-w-[2.75rem] md:px-2.5 md:py-2 md:text-[15px]">
                    {pad(parts.h)}
                </span>
                <span className="text-sm font-black text-[#991b1b] md:text-base">:</span>
                <span className="flex min-w-[2.5rem] items-center justify-center rounded-md bg-[#991b1b] px-2 py-1.5 text-[14px] font-black tabular-nums text-white shadow-inner md:min-w-[2.75rem] md:px-2.5 md:py-2 md:text-[15px]">
                    {pad(parts.m)}
                </span>
                <span className="text-sm font-black text-[#991b1b] md:text-base">:</span>
                <span className="flex min-w-[2.5rem] items-center justify-center rounded-md bg-[#991b1b] px-2 py-1.5 text-[14px] font-black tabular-nums text-white shadow-inner md:min-w-[2.75rem] md:px-2.5 md:py-2 md:text-[15px]">
                    {pad(parts.s)}
                </span>
            </div>
        </div>
    );
}

export default function ShopCategories({ flashSaleBanner = null, categories = [], flashSaleProducts = [] }) {
    return (
        <section className="w-full bg-transparent pt-6 pb-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">

                {/* Section Header - Clean Apple style */}
                <div className="relative flex items-center justify-center mb-4">
                    <h2 className="text-[22px] font-semibold tracking-tight font-[family-name:var(--font-outfit)]">
                        <span className="text-black">Featured </span>
                        <span className="text-black">Categories</span>
                    </h2>
                </div>

                {/* Category Card Grid - 4 per row on mobile */}
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 rounded-lg overflow-hidden border border-gray-200">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.id ? `cat-${cat.id}-${idx}` : `cat-fallback-${idx}`}
                            href={`/category/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}
                            className={`group flex flex-col h-full transition-all duration-300 bg-white hover:bg-gray-50 !text-black no-underline ${idx >= 6 ? 'hidden md:flex' : ''}`}
                        >
                            {/* Card Body - Content centered */}
                            <div className="flex-1 flex flex-col items-center justify-center p-1.5 md:p-3 min-h-[60px] md:min-h-[90px]">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={cat.image || "/no-image.svg"}
                                        alt={cat.name || 'Category'}
                                        width={100}
                                        height={100}
                                        className="w-auto h-auto max-h-[35px] md:max-h-[55px] object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                        unoptimized
                                    />
                                </div>
                            </div>

                            {/* Card Footer - Text at the bottom */}
                            <div className="pb-2 md:pb-4 px-1.5 md:px-3 text-center">
                                <span className="text-[9px] md:text-[11px] font-medium text-black group-hover:text-black transition-colors block truncate font-[family-name:var(--font-outfit)]">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center mt-4 mb-8">
                    <Link href="/categories" className="text-[9px] font-bold text-gray-500 hover:bg-black hover:text-white hover:border-black px-3 py-1 border border-gray-200 rounded-full uppercase tracking-widest transition-all font-[family-name:var(--font-outfit)] md:text-[12px] md:px-6 md:py-2">
                        See All
                    </Link>
                </div>

                {/* Mobile-only: between categories and flash deals */}

                {/* Flash Sale — stacked sections with gap (header / each row / CTA separate) */}
                {flashSaleProducts.length > 0 && (() => {
                    const flashItems = flashSaleProducts.slice(0, 12);
                    const rows = [];
                    for (let i = 0; i < flashItems.length; i += 6) {
                        rows.push(flashItems.slice(i, i + 6));
                    }

                    return (
                        <div className="flex flex-col gap-4">
                            {/* Header — own card (overflow visible so badge image can hang past the edge) */}
                            <div className="relative overflow-visible rounded-lg border border-[#f0e0d4] shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex items-center min-h-[40px] md:min-h-[56px]">
                                {/* Video background */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg">
                                    {flashSaleBanner?.image ? (
                                        <img
                                            src={flashSaleBanner.image.startsWith('http') ? flashSaleBanner.image : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${flashSaleBanner.image}`}
                                            alt="Flash Sale"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src="/flash-sale.png"
                                            alt="Flash Sale"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="relative z-10 flex flex-wrap items-center gap-2 overflow-visible pl-1 md:gap-4 md:pl-2">
                                    <div className="relative z-10 shrink-0 -ml-4 translate-y-0 md:-ml-8 md:translate-y-0.5">
                                        <Image
                                            src="/flas%20sss.png"
                                            alt="Flash Sale"
                                            width={220}
                                            height={140}
                                            className="pointer-events-none h-auto w-[102px] select-none object-contain drop-shadow-lg md:w-[138px]"
                                            unoptimized
                                            priority={false}
                                        />
                                    </div>
                                    <FlashSaleCountdown />
                                </div>
                            </div>

                            {/* One card per product row (5 per row on large screens) */}
                            {rows.map((row, rowIdx) => (
                                <div key={`flash-row-${rowIdx}`}>
                                    <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-6 md:overflow-visible">
                                        {row.map((product, idx) => (
                                            <div key={product.id ?? `${rowIdx}-${idx}`} className="flex-none w-[calc(50%-4px)] md:w-auto transition-transform duration-300 hover:scale-[1.02]">
                                                <ProductCard product={product} variant="default" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        </div>
                    );
                })()}
            </div>
        </section>
    );
}






















