"use client";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';
import { useRef } from 'react';

export default function NewArrivals({ products = [] }) {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const cardWidth = scrollRef.current.querySelector('div').offsetWidth + 12;
        scrollRef.current.scrollBy({ left: dir === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' });
    };

    return (
        <section className="w-full bg-transparent py-6 md:py-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[48px] font-bold tracking-tight">
                            <span className="text-[#0f172a]">Just </span>
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Landed</span>
                        </h2>
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase">New</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2">
                            <button onClick={() => scroll('prev')} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <FiChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => scroll('next')} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-3 -my-3">
                    {products.map((product) => (
                        <div key={product.id} className="flex-none w-[calc(20%-10px)] rounded-xl overflow-hidden border border-gray-200 [box-shadow:0_6px_10px_-2px_rgba(0,0,0,0.08)] h-[320px]">
                            <ProductCard product={product} variant="default" className="!border-0 !rounded-none !shadow-none hover:!shadow-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
