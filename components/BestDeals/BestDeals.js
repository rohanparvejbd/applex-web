import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';

export default function BestDeals({ deals = [] }) {
    return (
        <section className="w-full py-6 md:py-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div>
                        <h2 className="text-[48px] font-bold tracking-tight">
                            <span className="text-gray-900">Big </span>
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Saves</span>
                        </h2>
                    </div>
                    <Link href="/special-offers" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 transition-colors">
                        View All <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                    {deals.map((deal) => (
                        <ProductCard key={deal.id} product={deal} variant="default" />
                    ))}
                </div>
            </div>
        </section>
    );
}

