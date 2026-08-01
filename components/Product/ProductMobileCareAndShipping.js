'use client';

import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import ApplexCare from './ApplexCare';

export default function ProductMobileCareAndShipping({
    product,
    currentPriceNumber,
    selectedCarePlans = [],
    toggleCarePlan,
    emiOpenTrigger = 0,
    className = '',
    showCare = true,
    showShipping = true,
}) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = product ? isInWishlist(product.id) : false;

    if (!showCare && !showShipping) return null;

    return (
        <div className={`lg:hidden space-y-6 ${className}`.trim()}>
            {showCare && (
                <ApplexCare
                    product={product}
                    currentPrice={currentPriceNumber}
                    selectedCarePlans={selectedCarePlans}
                    toggleCarePlan={toggleCarePlan}
                    openEmiTrigger={emiOpenTrigger}
                />
            )}

            {showShipping && (
            <div className="border border-gray-200 rounded-xl bg-white px-4 py-3 flex items-center justify-between gap-3 min-w-0">
                <p className="text-sm font-bold text-gray-900 min-w-0">
                    Reach you within <span className="text-[#ff8a00]">0-3 business days</span>
                </p>
                <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="h-10 w-10 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center hover:text-red-500 transition-colors shrink-0"
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <FiHeart
                        className={`transition-all ${isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500'}`}
                        size={18}
                    />
                </button>
            </div>
            )}
        </div>
    );
}
