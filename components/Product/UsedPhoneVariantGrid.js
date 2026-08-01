'use client';

import React, { useMemo, useState } from 'react';
import { FiGlobe, FiHardDrive, FiBox, FiChevronDown } from 'react-icons/fi';
import { applyProductLevelDiscount, getVariantListPriceNumber } from '../../hooks/useProductVariantSelection';

const normalizeTaka = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const raw = String(value).replace(/à§³/g, '\u09F3').trim();
    if (!raw) return '';
    if (raw.startsWith('\u09F3')) return raw.replace(/^\u09F3\s*/, '\u09F3');
    const numericPart = raw.replace(/[^\d.,]/g, '');
    return numericPart ? `\u09F3${numericPart}` : raw;
};

function getConditionStyle(conditionText) {
    const text = String(conditionText || '').toLowerCase();
    if (text.includes('excellent') || text.includes('new') || text.includes('100%')) {
        return 'bg-[#ff8a00] text-white'; // Brand orange instead of green
    }
    if (text.includes('good') || text.includes('90') || text.includes('80')) {
        return 'bg-gray-800 text-white'; // Dark gray
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
        scrollToVariantSection
    } = variantSelection;

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

    const handleSelectVariant = (imei) => {
        if (imei.color) setSelectedColor(imei.color);
        if (imei.storage) setSelectedStorage(imei.storage);
        if (imei.battery_life) setSelectedBattery(imei.battery_life);
        if (imei.region) setSelectedRegion(imei.region);

        if (onBuyNow) {
            onBuyNow();
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
                        <h2 className="text-2xl md:text-[32px] font-black text-gray-900 tracking-tight mb-2 relative inline-block">
                            Pick Your Perfect Match
                            <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#ffb347] rounded-full" />
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Sort by Price */}
                        <div className="relative">
                            <select
                                value={sortByPrice}
                                onChange={(e) => setSortByPrice(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff8a00] focus:border-[#ff8a00] cursor-pointer shadow-sm transition-shadow"
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
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff8a00] focus:border-[#ff8a00] cursor-pointer shadow-sm transition-shadow"
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
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff8a00] focus:border-[#ff8a00] cursor-pointer shadow-sm transition-shadow"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                        {processedImeis.map((imei, idx) => {
                            const displayPrice = normalizeTaka(`\u09F3${Math.round(imei._computedPrice).toLocaleString('en-IN')}`);
                            const conditionLabel = formatBatteryLabel(imei.battery_life || 'Used');
                            const conditionColorClass = getConditionStyle(conditionLabel);

                            return (
                                <div 
                                    key={imei.id || idx} 
                                    className="flex flex-col bg-white border border-gray-200/90 rounded-2xl p-4 md:p-5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-[#ffb347] transition-all duration-300"
                                >
                                    {/* Top Badge */}
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${conditionColorClass}`}>
                                            {conditionLabel}
                                        </span>
                                    </div>

                                    {/* Structured Gray Details Box */}
                                    <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-4 flex flex-col gap-3 mb-5">
                                        {/* Color */}
                                        <div className="flex items-center gap-2.5">
                                            <div 
                                                className="w-4 h-4 rounded-full shadow-sm border border-gray-200/80 shrink-0"
                                                style={{ backgroundColor: imei.color_code || '#e5e7eb' }}
                                            />
                                            <span className="text-[14px] md:text-[15px] font-medium text-[#111827] truncate">
                                                Color: <span className="font-semibold">{imei.color || 'Standard'}</span>
                                            </span>
                                        </div>

                                        {/* Region */}
                                        {imei.region && (
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    <FiGlobe className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="text-[14px] md:text-[15px] font-medium text-[#111827] truncate">
                                                    Region: <span className="font-semibold">{imei.region}</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Storage */}
                                        {imei.storage && (
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    <FiHardDrive className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="text-[14px] md:text-[15px] font-medium text-[#111827] truncate">
                                                    Storage: <span className="font-semibold">{imei.storage}</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Box Condition */}
                                        {imei.box_status && (
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    <FiBox className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="text-[14px] md:text-[15px] font-medium text-[#111827] truncate">
                                                    Box Condition: <span className="font-semibold">{imei.box_status}</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Row: Price & Buy */}
                                    <div className="flex flex-col gap-3 mt-auto pt-2">
                                        <span 
                                            className="text-xl md:text-2xl font-black text-gray-900 tracking-tight"
                                            style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                                        >
                                            {displayPrice}
                                        </span>
                                        
                                        <button
                                            onClick={() => handleSelectVariant(imei)}
                                            className="w-full text-center shrink-0 px-6 py-2.5 rounded-xl border-2 border-[#ff8a00] text-[#ff8a00] font-black text-sm hover:bg-[#ff8a00] hover:text-white transition-colors duration-200 shadow-sm"
                                        >
                                            Buy
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

