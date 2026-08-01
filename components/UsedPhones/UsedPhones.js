"use client";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';
import { useRef, useState } from 'react';

const SERIES = [
    { label: 'All', id: null },
    { label: '13 Series', id: 7835 },
    { label: '14 Series', id: 7834 },
    { label: '15 Series', id: 7832 },
    { label: '16 Series', id: 7831 },
    { label: '17 Series', id: 7830 },
];

export default function UsedPhones({ products = [] }) {
    if (!products.length) return null;
    const scrollRef = useRef(null);
    const [active, setActive] = useState(null);
    const [filtered, setFiltered] = useState(products);
    const [loading, setLoading] = useState(false);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const cardWidth = scrollRef.current.querySelector('div').offsetWidth + 12;
        scrollRef.current.scrollBy({ left: dir === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' });
    };

    const handleFilter = async (id) => {
        setActive(id);
        if (!id) {
            setFiltered(products);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/public/subcategorywise-products/${id}`);
            const data = await res.json();
            const items = data?.data || [];
            const mapped = items.map(p => {
                const basePrice = Number(p.retails_price || p.price || 0);
                const discountValue = Number(p.discount || 0);
                const discountType = String(p.discount_type || '').toLowerCase();
                const hasDiscount = discountValue > 0 && discountType !== '0';
                const price = hasDiscount
                    ? discountType === 'percentage'
                        ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
                        : Math.max(0, basePrice - discountValue)
                    : basePrice;
                return {
                    id: p.id,
                    name: p.name,
                    price: `৳ ${price.toLocaleString('en-IN')}`,
                    oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
                    imageUrl: p.image_path || (Array.isArray(p.image_paths) && p.image_paths[0]) || p.image_url || '/no-image.svg',
                };
            });
            setFiltered(mapped);
        } catch {
            setFiltered([]);
        }
        setLoading(false);
    };

    return (
        <section className="w-full py-6 md:py-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[48px] font-bold tracking-tight">
                        <span className="text-gray-900">Used </span>
                        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">iPhones</span>
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap justify-end flex-1 mx-6">
                        {SERIES.map((s) => (
                            <button key={s.id} onClick={() => handleFilter(s.id)} className={`px-5 py-2 text-[14px] font-medium rounded-full border transition-all duration-200 ${active === s.id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-black hover:text-white hover:border-black'}`}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('prev')} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => scroll('next')} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex gap-3 py-3">
                        {[1,2,3,4,5].map(i => <div key={i} className="flex-none w-[calc(20%-10px)] h-[320px] rounded-xl bg-gray-100 animate-pulse" />)}
                    </div>
                ) : (
                    <div ref={scrollRef} className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-3 -my-3">
                        {filtered.map((product) => (
                            <div key={product.id} className="flex-none w-[calc(20%-10px)] rounded-xl overflow-hidden border border-gray-200 h-[320px]">
                                <ProductCard product={product} variant="default" className="!border-0 !rounded-none !shadow-none hover:!shadow-none" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
