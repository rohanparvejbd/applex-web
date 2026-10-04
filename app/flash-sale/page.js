"use client";
import { useState, useEffect } from "react";
import { getCampaigns } from "../../lib/api";
import ProductCard from "../../components/Shared/PremiumProductCard";

function CountdownTimer() {
    const [time, setTime] = useState({ hours: 11, minutes: 45, seconds: 13 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) return { hours, minutes, seconds: seconds - 1 };
                if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
                if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = n => String(n).padStart(2, "0");

    return (
        <div className="flex items-center justify-center gap-4">
            {[{ label: "Hours", value: time.hours }, { label: "Minutes", value: time.minutes }, { label: "Seconds", value: time.seconds }].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center justify-center rounded-[6px] bg-red-600 w-[22vw] h-[10vw] sm:w-[155px] sm:h-[74px]">
                    <span className="text-[4.5vw] sm:text-4xl font-black text-white leading-none">{pad(value)}</span>
                    <span className="text-[2vw] sm:text-xs font-bold text-red-100 mt-1 uppercase tracking-widest">{label}</span>
                </div>
            ))}
        </div>
    );
}

export default function FlashSalePage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCampaigns().then(res => {
            const campaignsData = res?.campaigns?.data || res?.data || [];
            const firstCampaign = campaignsData[0];
            
            if (firstCampaign) {
                const campaignProducts = firstCampaign.campaign_products || firstCampaign.products || firstCampaign.items || [];
                const mappedProducts = campaignProducts.map(cp => cp.product ? cp.product : cp);
                setProducts(mappedProducts);
            } else {
                setProducts([]);
            }
        }).catch(() => {
            setProducts([]);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="bg-white min-h-screen font-[family-name:var(--font-outfit)]">
            {/* Timer Hero */}
            <div className="bg-white py-8">
                <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Deal Ends In</p>
                    <CountdownTimer />
                </div>
            </div>

            {/* Products */}
            <div className="max-w-6xl mx-auto px-4 pt-3 pb-6">
                <div>
                </div>
                {isLoading ? (
                    <div className="text-center py-20 text-gray-400 text-sm">Loading deals...</div>
                ) : products.length > 0 ? (
                    <div className="border border-red-200 bg-red-50/30 rounded-lg p-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {products.map((product, idx) => (
                                <ProductCard key={product.id ?? idx} product={product} variant="default" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 text-sm">No active campaigns found.</div>
                )}
            </div>
        </div>
    );
}

