"use client";

import { useState, useEffect } from 'react';
import { FiZap } from "react-icons/fi";
import { getBestDealsFromServer } from '../../lib/api';
import ProductCard from '../../components/Shared/PremiumProductCard';

export default function SpecialOffersPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDeals() {
            try {
                const res = await getBestDealsFromServer();
                const raw = res?.data?.data || res?.data || [];
                const arr = Array.isArray(raw) ? raw : [];

                const mapped = arr.map((p) => {
                    const basePrice = Number(p.retails_price || p.price || 0);
                    const discountValue = Number(p.discount || 0);
                    const discountType = String(p.discount_type || '').toLowerCase();
                    const hasDiscount = discountValue > 0 && discountType !== '0';
                    const price = hasDiscount
                        ? discountType === 'percentage'
                            ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
                            : Math.max(0, basePrice - discountValue)
                        : basePrice;
                    const discountLabel = hasDiscount
                        ? discountType === 'percentage'
                            ? `-${discountValue}%`
                            : `৳ ${discountValue.toLocaleString('en-IN')}`
                        : null;
                    let imageUrl = p.image_path ||
                        (Array.isArray(p.image_paths) && p.image_paths.length > 0 ? p.image_paths[0] : null) ||
                        p.image_url || '/no-image.svg';
                    if (typeof imageUrl === 'string') imageUrl = imageUrl.trim();
                    return {
                        id: p.id,
                        name: p.name,
                        price: `৳ ${price.toLocaleString('en-IN')}`,
                        oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
                        discount: discountLabel,
                        imageUrl,
                        brand: p.brands?.name || p.brand_name || '',
                    };
                });

                setProducts(mapped);
            } catch (error) {
                console.error("Failed to fetch deals:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDeals();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-black py-6 md:py-8">
                <div className="max-w-[1248px] mx-auto px-4 md:px-0 flex items-center gap-3">
                    <FiZap className="text-orange-500 w-6 h-6" />
                    <h1 className="text-xl md:text-2xl font-black text-white tracking-tight font-[family-name:var(--font-outfit)]">
                        Flash Sale — All Deals
                    </h1>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-[1248px] mx-auto px-4 md:px-0 py-8">
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} variant="default" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <FiZap size={40} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-900">কোনো deal নেই এখন</h3>
                        <p className="text-gray-500 mt-2">শীঘ্রই আসছে!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
