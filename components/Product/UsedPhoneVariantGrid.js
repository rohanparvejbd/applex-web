'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { FiGlobe, FiHardDrive, FiBox, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { applyProductLevelDiscount, getVariantListPriceNumber } from '../../hooks/useProductVariantSelection';
import { useCart } from '../../context/CartContext';

const normalizeTaka = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const raw = String(value).replace(/à§³/g, '\u09F3').trim();
    if (!raw) return '';
    if (raw.startsWith('\u09F3')) return raw.replace(/^\u09F3\s*/, '\u09F3');
    const numericPart = raw.replace(/[^\d.,]/g, '');
    return numericPart ? `\u09F3${numericPart}` : raw;
};

function getConditionLabel() {
    return 'Excellent';
}

function getConditionStyle(conditionText) {
    const text = String(conditionText || '').toLowerCase();
    if (text.includes('excellent') || text.includes('new') || text.includes('100%')) {
        return 'bg-black text-white';
    }
    if (text.includes('good') || text.includes('90') || text.includes('80')) {
        return 'bg-gray-800 text-white';
    }
    return 'bg-gray-500 text-white';
}

export default function UsedPhoneVariantGrid({
    product,
    variantSelection,
    onBuyNow
}) {
    const {
        formatBatteryLabel,
        setSelectedColor,
        setSelectedStorage,
        setSelectedBattery,
        setSelectedRegion,
        scrollToVariantSection,
        getCartPayloadAndVariants
    } = variantSelection;
    const { addToCart } = useCart();

    const [sortByPrice, setSortByPrice] = useState('default');
    const [filterColor, setFilterColor] = useState('all');
    const [filterBattery, setFilterBattery] = useState('all');

    const rawImeis = useMemo(() => {
        return (product?.rawImeis || []).filter((i) => i.in_stock === 1);
    }, [product]);

    // Extract unique values for filters
    const uniqueColors = useMemo(() => {
        const colors = new Set(rawImeis.map(i => i.color).filter(Boolean));
        return Array.from(colors).sort();
    }, [rawImeis]);

    const uniqueBatteries = useMemo(() => {
        const batteries = new Set(rawImeis.map(i => i.battery_life).filter(Boolean));
        return Array.from(batteries).sort();
    }, [rawImeis]);

    // Apply filters and sorting
    const processedImeis = useMemo(() => {
        let result = [...rawImeis];

        // Apply Color Filter
        if (filterColor !== 'all') {
            result = result.filter(i => i.color === filterColor);
        }

        // Apply Battery Filter
        if (filterBattery !== 'all') {
            result = result.filter(i => i.battery_life === filterBattery);
        }

        // Apply Sorting
        result.forEach(imei => {
            const listPrice = getVariantListPriceNumber(imei);
            imei._computedPrice = listPrice != null 
                ? applyProductLevelDiscount(listPrice, product) 
                : (Number(product?.rawPrice) || 0);
        });

        if (sortByPrice === 'asc') {
            result.sort((a, b) => a._computedPrice - b._computedPrice);
        } else if (sortByPrice === 'desc') {
            result.sort((a, b) => b._computedPrice - a._computedPrice);
        }

        return result;
    }, [rawImeis, filterColor, filterBattery, sortByPrice, product]);

    if (!rawImeis || rawImeis.length === 0) {
        return null;
    }

    const handleAddToCart = (imei) => {
        if (imei.color) setSelectedColor(imei.color);
        if (imei.storage) setSelectedStorage(imei.storage);
        if (imei.battery_life) setSelectedBattery(imei.battery_life);
        if (imei.region) setSelectedRegion(imei.region);
        if (getCartPayloadAndVariants) {
            const { cartProduct, cartVariants } = getCartPayloadAndVariants({ imeiNumber: imei.imei_number });
            addToCart(cartProduct, 1, cartVariants);
        } else {
            scrollToVariantSection('configure-device-purchase');
        }
    };

    return (
        <div id="used-phones-grid" className="mt-8 md:mt-10 w-full max-w-full overflow-x-clip bg-white py-6 md:py-10 scroll-mt-32 md:scroll-mt-[15rem]">
            <div className="max-w-[1248px] mx-auto px-3 sm:px-4 md:px-0 min-w-0">
                
                {/* Header & Filter Bar */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 md:mb-10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-2 relative inline-block font-[family-name:var(--font-outfit)]">
                            Pick Your Perfect Match
                            <div className="absolute -bottom-1 left-0 w-12 h-[2px] bg-gray-900" />
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Sort by Price */}
                        <div className="relative">
                            <select
                                value={sortByPrice}
                                onChange={(e) => setSortByPrice(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-gray-400 cursor-pointer font-[family-name:var(--font-outfit)]"
                            >
                                <option value="default">Sort by Price</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                            <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Filter by Color */}
                        {uniqueColors.length > 0 && (
                            <div className="relative">
                                <select
                                    value={filterColor}
                                    onChange={(e) => setFilterColor(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-gray-400 cursor-pointer font-[family-name:var(--font-outfit)]"
                                >
                                    <option value="all">Any Color</option>
                                    {uniqueColors.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        )}

                        {/* Filter by Battery Life */}
                        {uniqueBatteries.length > 0 && (
                            <div className="relative">
                                <select
                                    value={filterBattery}
                                    onChange={(e) => setFilterBattery(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-gray-400 cursor-pointer font-[family-name:var(--font-outfit)]"
                                >
                                    <option value="all">Any Condition</option>
                                    {uniqueBatteries.map(battery => (
                                        <option key={battery} value={battery}>{formatBatteryLabel(battery)}</option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {processedImeis.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 will-change-auto">
                        {processedImeis.map((imei, idx) => {
                            const displayPrice = normalizeTaka(`\u09F3${Math.round(imei._computedPrice).toLocaleString('en-IN')}`);
                            const conditionLabel = 'Excellent';
                            const conditionColorClass = getConditionStyle(conditionLabel);

                            return (
                                <div
                                    key={imei.id || idx}
                                    className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-200"
                                    style={{ contain: 'layout style' }}
                                >
                                    {/* Condition Badge - top center */}
                                    <div className="flex justify-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-semibold tracking-wide font-[family-name:var(--font-outfit)] ${conditionColorClass}`} style={{ borderRadius: '0 0 50px 50px' }}>
                                            ★ {conditionLabel}
                                        </span>
                                    </div>
                                    {/* Top Section: Image + Details */}
                                    <div className="p-3 pb-0 flex gap-3">
                                        {/* Left: Product Image */}
                                        <div className="w-[38%] flex-shrink-0 flex items-center justify-center">
                                            {(() => {
                                                const colorData = product?.rawImeis?.find(r => r.color === imei.color && r.image_path);
                                                const imageSrc = colorData?.image_path || product?.images?.[0];
                                                return imageSrc ? (
                                                    <Image
                                                        src={imageSrc}
                                                        alt={imei.color || product?.name || 'Product'}
                                                        width={200}
                                                        height={280}
                                                        className="w-full h-auto object-contain"
                                                        unoptimized
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 bg-gray-50 rounded-xl flex items-center justify-center">
                                                        <FiBox className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Right: Details */}
                                        <div className="flex-1 flex flex-col pt-1">
                                            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight leading-tight font-[family-name:var(--font-outfit)]">{product?.name || 'Product'}</h3>
                                            <p className="text-gray-400 text-[12px] font-medium mb-1 font-[family-name:var(--font-outfit)]">{imei.storage || ''}{imei.storage && imei.color ? ' | ' : ''}{imei.color || ''}</p>
                                            <div className="flex flex-col divide-y divide-gray-100">
                                                {imei.region && (
                                                    <div className="flex gap-3 items-center py-0.5">
                                                        <div className="flex items-center justify-center flex-shrink-0">
                                                            <FiGlobe className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-[11px] font-semibold font-[family-name:var(--font-outfit)]">Region</p>
                                                            <p className="text-[13px] font-bold text-gray-900 font-[family-name:var(--font-outfit)]">{imei.region}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {imei.storage && (
                                                    <div className="flex gap-3 items-center py-0.5">
                                                        <div className="flex items-center justify-center flex-shrink-0">
                                                            <FiHardDrive className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-[11px] font-semibold font-[family-name:var(--font-outfit)]">Storage</p>
                                                            <p className="text-[13px] font-bold text-gray-900 font-[family-name:var(--font-outfit)]">{imei.storage}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {imei.battery_life && (
                                                    <div className="flex gap-3 items-center py-0.5">
                                                        <div className="flex items-center justify-center flex-shrink-0">
                                                            <FiBox className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-[11px] font-semibold font-[family-name:var(--font-outfit)]">Battery Health</p>
                                                            <p className="text-[13px] font-bold text-gray-900 font-[family-name:var(--font-outfit)]">{imei.battery_life}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Box Condition Banner */}
                                    {(
                                        <div className="px-3 mt-1">
                                            <div className="bg-gray-50 rounded-md px-3 py-2 flex justify-between items-center border border-gray-100">
                                                <span className="font-bold text-gray-900 text-[11px] sm:text-sm">Box Condition</span>
                                                <div className="flex items-center gap-1 sm:gap-2 text-gray-700 font-bold text-[11px] sm:text-sm">
                                                    <span>{imei.box_status || 'Without Box'}</span>
                                                    <FiBox className="w-4 h-4 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div className="px-3 mt-1">
                                        <div className="h-px w-full bg-gray-100" />
                                    </div>

                                    {/* Price & Buy */}
                                    <div className="p-2 sm:p-3 pt-2 flex justify-between items-end">
                                        <div>
                                            <p className="text-gray-400 text-[10px] sm:text-[12px] font-medium mb-0.5">Price</p>
                                            <span
                                                className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-outfit)]"
                                                style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                                            >
                                                {displayPrice}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(imei)}
                                            className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors rounded-md px-3 py-1.5 flex items-center gap-1.5 font-semibold text-sm font-[family-name:var(--font-outfit)]"
                                        >
                                            <FiShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-20 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-gray-500 font-medium">No devices match your selected filters.</p>
                        <button 
                            onClick={() => { setFilterColor('all'); setFilterBattery('all'); }}
                            className="mt-4 text-[#ff8a00] font-bold hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

