"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../Shared/PremiumProductCard';
import { useRef } from 'react';

function RelatedProductsCarousel({ products }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const cardWidth = scrollRef.current.querySelector('div')?.offsetWidth + 12 || 220;
        scrollRef.current.scrollBy({ left: dir === 'next' ? cardWidth * 2 : -cardWidth * 2, behavior: 'smooth' });
        setTimeout(checkScroll, 400);
    };

    return (
        <div className="mb-12 relative group/carousel">
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {products.map((product) => (
                    <div key={product.id} className="flex-none w-[calc(16.666%-10px)]">
                        <ProductCard product={product} variant="default" />
                    </div>
                ))}
            </div>
            {canScrollLeft && (
                <button
                    onClick={() => scroll('prev')}
                    className="absolute left-2 top-[130px] md:top-[140px] -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all z-10 shadow-md"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
            )}
            {canScrollRight && (
                <button
                    onClick={() => scroll('next')}
                    className="absolute right-2 top-[130px] md:top-[140px] -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all z-10 shadow-md"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            )}
        </div>
    );
}

export default function ProductTabs({ description, specifications, videoUrl, recentlyViewed = [], relatedProducts = [] }) {
    const [activeTab, setActiveTab] = useState('specifications');

    const specRows = useMemo(() => {
        if (!Array.isArray(specifications)) return [];
        return specifications;
    }, [specifications]);

    const sections = [
        { id: 'specifications', label: 'SPECIFICATION' },
        { id: 'description', label: 'DESCRIPTION' },
        { id: 'video', label: 'VIDEO' },
    ];

    return (
        <div className="mt-12 md:mt-24 w-full">
            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <RelatedProductsCarousel products={relatedProducts} />
            )}
            {/* Header Row: Tabs and Recently Viewed Heading synchronized */}
            <div className="flex items-center gap-3 md:gap-4 flex-wrap mb-8">
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`px-5 py-2 md:px-7 md:py-2.5 rounded-md text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all duration-300 border font-[family-name:var(--font-outfit)] ${
                                activeTab === section.id
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                            }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Row */}
            <div className="w-full">

                {/* Content */}
                <div className="w-full overflow-hidden">
                    {activeTab === 'specifications' && (
                        <section
                            id="specifications"
                            className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full overflow-hidden"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight px-4 font-[family-name:var(--font-outfit)]">Specifications</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white w-full overflow-x-auto">
                                {specRows.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 font-medium italic">
                                        Product specifications are being updated.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {specRows.map((spec, idx) => (
                                            <div key={idx} className={`flex flex-col sm:flex-row transition-all ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <div className="w-full sm:w-[28%] p-2.5 md:p-3 text-[11px] md:text-[12px] font-semibold text-gray-400 uppercase tracking-wider flex items-start sm:items-center border-r border-gray-100 font-[family-name:var(--font-outfit)]">
                                                    {spec.name}
                                                </div>
                                                <div className="w-full sm:flex-1 p-2.5 md:p-3 text-[13px] md:text-[14px] text-gray-800 font-medium leading-snug break-words font-[family-name:var(--font-outfit)]">
                                                    {spec.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'description' && (
                        <section
                            id="description"
                            className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-2 md:px-4 py-2 w-full overflow-hidden break-words"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 tracking-tight font-[family-name:var(--font-outfit)]">Description</h3>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed md:leading-loose w-full overflow-hidden break-words">
                                <div 
                                    className="w-full overflow-hidden break-words [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:mb-6 [&>h3]:text-xl [&>h3]:font-black [&>h3]:mb-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:my-10 [&_img]:mx-auto [&_img]:shadow-lg [&_*]:max-w-full [&_*]:break-words"
                                    dangerouslySetInnerHTML={{ __html: description || '<p>No detailed description available yet.</p>' }} 
                                />
                            </div>
                        </section>
                    )}

                    {activeTab === 'video' && (
                        <section
                            id="video"
                            className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-2 md:px-4 py-2 w-full overflow-hidden"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 tracking-tight font-[family-name:var(--font-outfit)]">Video</h3>
                            <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                                {videoUrl ? (
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={videoUrl}
                                            title="Product Video"
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400 font-medium">
                                        Product video will be added soon.
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>


            </div>
        </div>
    );
}
