"use client";
import { useMemo, useState } from 'react';
import ProductCard from '../Shared/PremiumProductCard';

const PAGE_SIZE = 12;

export default function FeaturedProducts({
    bestSellers = [],
    newArrivals = [],
    flashDeals = []
}) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const allProducts = useMemo(() => {
        const seen = new Set();
        return [...bestSellers, ...newArrivals].filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });
    }, [bestSellers, newArrivals]);

    const visibleProducts = useMemo(() => {
        return allProducts.slice(0, visibleCount);
    }, [allProducts, visibleCount]);

    const hasMore = visibleCount < allProducts.length;

    return (
        <section className="w-full bg-transparent py-6 md:py-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <h2 className="text-[48px] font-bold tracking-tight">
                        <span className="text-[#0f172a]">Discover </span>
                        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">More</span>
                    </h2>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                    {visibleProducts.map((product) => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                            className="px-8 py-2.5 rounded-full border border-gray-300 bg-white text-[13px] font-medium text-gray-600 transition-all hover:bg-black hover:text-white hover:border-black"
                        >
                            See More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
