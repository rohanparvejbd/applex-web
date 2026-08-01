"use client";

import { useMemo, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';

const PAGE_SIZE = 12;

export default function FeaturedProducts({
    bestSellers = [],
    newArrivals = [],
    flashDeals = []
}) {
    const [activeTab, setActiveTab] = useState('Best Sellers');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const tabs = ['Best Sellers', 'New Arrivals'];

    const allProducts = useMemo(() => {
        if (activeTab === 'New Arrivals') return newArrivals;
        return bestSellers;
    }, [activeTab, bestSellers, newArrivals]);

    const visibleProducts = useMemo(() => {
        return allProducts.slice(0, visibleCount);
    }, [allProducts, visibleCount]);

    const hasMore = visibleCount < allProducts.length;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setVisibleCount(PAGE_SIZE);
    };

    return (
        <section className="w-full bg-transparent py-6 md:py-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 md:mb-10">
                    <div>
                        <h2 className="text-[48px] font-bold tracking-tight">
                            <span className="text-[#0f172a]">Discover </span>
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">More</span>
                        </h2>
                    </div>

                    {/* Pill Toggles */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${activeTab === tab
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-black hover:text-white hover:border-black'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                    {visibleProducts.map((product) => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                            className="px-8 py-2.5 rounded-full border border-gray-300 bg-white text-[13px] font-medium text-gray-600 transition-all hover:bg-black hover:text-white hover:border-black"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

