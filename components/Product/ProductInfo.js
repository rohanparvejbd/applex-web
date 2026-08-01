"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShare2, FiHeart, FiCreditCard, FiGift, FiFileText, FiShuffle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCompare } from '../../context/CompareContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBrandCache } from '../../context/BrandCacheContext';
import toast from 'react-hot-toast';
import ApplexCare from './ApplexCare';
import ProductPurchaseBar from './ProductPurchaseBar';
import { FiChevronDown } from 'react-icons/fi';
import { WHATSAPP_URL } from '../../lib/siteContact';

/** Same file as `categoryIconMap` iphone entry in `components/Header/Header.js`. */
const CATEGORY_STRIP_APPLE_SVG = '/svg/apple logo.svg';

const BRAND_FALLBACK_LOGOS = [
    { match: ['apple', 'iphone', 'ipad', 'macbook', 'imac'], logo: CATEGORY_STRIP_APPLE_SVG },
    { match: ['samsung', 'galaxy'], logo: 'https://cdn.simpleicons.org/samsung/1428A0' },
    { match: ['xiaomi', 'redmi', 'mi'], logo: 'https://cdn.simpleicons.org/xiaomi/FF6900' },
    { match: ['huawei', 'honor'], logo: 'https://cdn.simpleicons.org/huawei/CC0000' },
    { match: ['oppo'], logo: 'https://cdn.simpleicons.org/oppo/2D683D' },
    { match: ['vivo'], logo: 'https://cdn.simpleicons.org/vivo/415FFF' },
    { match: ['oneplus'], logo: 'https://cdn.simpleicons.org/oneplus/F5010C' },
    { match: ['google', 'pixel'], logo: 'https://cdn.simpleicons.org/google/4285F4' },
    { match: ['realme'], logo: 'https://cdn.simpleicons.org/realme/FFC915' },
    { match: ['nokia'], logo: 'https://cdn.simpleicons.org/nokia/005AFF' },
    { match: ['motorola'], logo: 'https://cdn.simpleicons.org/motorola/E1140A' },
    { match: ['sony'], logo: 'https://cdn.simpleicons.org/sony/000000' },
    { match: ['nothing'], logo: 'https://cdn.simpleicons.org/nothing/000000' },
    { match: ['infinix'], logo: 'https://cdn.simpleicons.org/infinix/43B02A' },
    { match: ['tecno'], logo: 'https://cdn.simpleicons.org/tecno/1476FF' },
    { match: ['anker'], logo: 'https://cdn.simpleicons.org/anker/00A7E1' },
    { match: ['baseus'], logo: 'https://cdn.simpleicons.org/baseus/1F2937' },
    { match: ['jbl'], logo: 'https://cdn.simpleicons.org/jbl/FF3300' },
    { match: ['soundcore'], logo: 'https://cdn.simpleicons.org/anker/00A7E1' },
    { match: ['beats'], logo: 'https://cdn.simpleicons.org/beatsbydre/E01F3D' },
];
const getBrandFallbackLogo = (brandName = '') => {
    const normalized = String(brandName || '').toLowerCase().trim();
    if (!normalized) return null;
    const found = BRAND_FALLBACK_LOGOS.find(entry =>
        entry.match.some(token => normalized.includes(token))
    );
    return found?.logo || null;
};
/** Same key as app/category/[slug]/page.js */
const APLEX_LAST_CATEGORY_STORAGE_KEY = 'applex_last_category_context';

const normalizeTaka = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const raw = String(value).replace(/à§³/g, '\u09F3').trim();
    if (!raw) return '';
    if (raw.startsWith('\u09F3')) return raw.replace(/^\u09F3\s*/, '\u09F3');
    const numericPart = raw.replace(/[^\d.,]/g, '');
    return numericPart ? `\u09F3${numericPart}` : raw;
};

export default function ProductInfo({
    product,
    variantSelection,
    selectedCarePlans = [],
    toggleCarePlan,
    onOpenEmiModal,
    emiOpenTrigger = 0,
}) {
    const { addToCompare } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { allBrands } = useBrandCache();
    const isWishlisted = product ? isInWishlist(product.id) : false;
    const [selectedPricingMode, setSelectedPricingMode] = useState('offer');

    const {
        hasVariants = false,
        isUsedPhoneProduct = false,
        allColors = [],
        allModels = [],
        allStorages = [],
        allBatteries = [],
        allRegions = [],
        availableModels = [],
        availableStorages = [],
        availableBatteries = [],
        availableRegions = [],
        selectedColor,
        setSelectedColor = () => {},
        selectedModel,
        setSelectedModel = () => {},
        selectedStorage,
        setSelectedStorage = () => {},
        selectedBattery,
        setSelectedBattery = () => {},
        selectedRegion,
        setSelectedRegion = () => {},
        variantListPriceNumber,
        currentPriceNumber = Number(product?.rawPrice) || 0,
        displayPrice = normalizeTaka(product?.price),
        displayOldPrice = normalizeTaka(product?.oldPrice),
        displayPriceAmount = '',
        displayOldPriceAmount = '',
        currentVariantImages,
        formatBatteryLabel = (v) => v,
        scrollToVariantSection = () => {},
        getCartPayloadAndVariants = () => ({ cartProduct: product, cartVariants: null }),
    } = variantSelection || {};

    useEffect(() => {
        setSelectedPricingMode('offer');
    }, [product?.id]);

    const hideMobileExtrasInInfo = isUsedPhoneProduct && hasVariants;

    const configureSteps = useMemo(() => {
        const steps = [
            { label: 'Color', done: !!selectedColor, sectionId: 'variant-color' },
        ];
        if (allModels.length > 0) {
            steps.push({ label: 'Model', done: !!selectedModel, sectionId: 'variant-model' });
        }
        if (allStorages.length > 0) {
            steps.push({ label: 'Storage', done: !!selectedStorage, sectionId: 'variant-storage' });
        }
        if (allBatteries.length > 0) {
            steps.push({
                label: 'Battery',
                done: !!selectedBattery,
                sectionId: 'variant-battery',
            });
        }
        if (allRegions.length > 0) {
            steps.push({ label: 'Region', done: !!selectedRegion, sectionId: 'variant-region' });
        }
        return steps;
    }, [
        selectedColor,
        selectedModel,
        selectedStorage,
        selectedBattery,
        selectedRegion,
        allModels.length,
        allStorages.length,
        allBatteries.length,
        allRegions.length,
    ]);

    const configureProgress = useMemo(() => {
        if (configureSteps.length === 0) return 0;
        const done = configureSteps.filter((s) => s.done).length;
        return Math.round((done / configureSteps.length) * 100);
    }, [configureSteps]);

    const saveAmount = useMemo(() => {
        if (!product.hasDiscount || Number(product.discountValue || 0) <= 0) return 0;
        const listBase = variantListPriceNumber ?? Number(product.originalPrice || 0);
        return Math.max(0, Math.round(listBase - currentPriceNumber));
    }, [product.hasDiscount, product.discountValue, variantListPriceNumber, product.originalPrice, currentPriceNumber]);

    const pricingStats = useMemo(() => {
        const offerPrice = Math.max(0, Math.round(currentPriceNumber));
        const regularPriceFromData = Number(product.originalPrice || 0);
        const regularPrice = regularPriceFromData > offerPrice
            ? regularPriceFromData
            : Math.round(offerPrice * 1.1);

        const catBlob = `${product?.category?.name || ''} ${product?.category?.slug || ''}`.toLowerCase();
        const isPhoneCategory = (() => {
            if (!catBlob.trim()) return false;
            if (catBlob.includes('headphone') || catBlob.includes('earphone') || catBlob.includes('airpods')) return false;
            if (catBlob.includes('iphone')) return true;
            if (catBlob.includes('smartphone') || catBlob.includes('smart phone')) return true;
            if (catBlob.includes('mobile')) return true;
            if (/\bphones?\b/.test(catBlob)) return true;
            return false;
        })();

        let minBooking = Math.max(1000, Math.floor((offerPrice * 0.12) / 500) * 500);
        let purchasePoints = Math.max(10, Math.floor((offerPrice / 1200) / 10) * 10);
        if (isPhoneCategory) {
            minBooking = 10000;
            purchasePoints = 15;
        }

        const emiMonthly = Math.max(1, Math.round(regularPrice / 12));

        return { offerPrice, regularPrice, minBooking, purchasePoints, emiMonthly };
    }, [currentPriceNumber, product.originalPrice, product?.category?.name, product?.category?.slug]);

    const matchedBrand = useMemo(() => {
        const currentBrandName = product.brand?.name?.trim();
        if (!currentBrandName) return null;

        const fromCache = (allBrands || []).find(
            (b) => b?.name?.trim().toLowerCase() === currentBrandName.toLowerCase()
        );

        const fallbackLogo = getBrandFallbackLogo(currentBrandName);
        const useCategoryStripApple =
            fallbackLogo === CATEGORY_STRIP_APPLE_SVG;

        return {
            id: fromCache?.id || product.brand?.id || product.brand?.brand_id || null,
            name: currentBrandName,
            image: useCategoryStripApple
                ? CATEGORY_STRIP_APPLE_SVG
                : fromCache?.image || product.brand?.image || fallbackLogo || null,
        };
    }, [allBrands, product.brand]);

    const categoryBrandHrefFromProduct = useMemo(() => {
        const slug = product?.category?.slug?.trim();
        if (!slug || !matchedBrand?.name) return '';
        const p = new URLSearchParams();
        p.set('brand', matchedBrand.name);
        return `/category/${slug}?${p.toString()}`;
    }, [product?.category?.slug, matchedBrand?.name]);

    const [brandListingHref, setBrandListingHref] = useState(categoryBrandHrefFromProduct);

    useEffect(() => {
        if (!matchedBrand?.name) {
            setBrandListingHref('');
            return;
        }
        let slug = (product?.category?.slug || '').trim();
        let subId = 0;
        if (typeof window !== 'undefined') {
            try {
                const raw = sessionStorage.getItem(APLEX_LAST_CATEGORY_STORAGE_KEY);
                if (raw) {
                    const ctx = JSON.parse(raw);
                    if (ctx?.slug && String(ctx.slug).trim()) {
                        slug = String(ctx.slug).trim();
                        subId = Math.max(0, parseInt(String(ctx.subcategoryId || '0'), 10) || 0);
                    }
                }
            } catch {
                // ignore invalid JSON
            }
        }
        if (!slug) {
            setBrandListingHref('');
            return;
        }
        const p = new URLSearchParams();
        p.set('brand', matchedBrand.name);
        if (subId > 0) p.set('subcategory_id', String(subId));
        setBrandListingHref(`/category/${slug}?${p.toString()}`);
    }, [matchedBrand?.name, product?.category?.slug, product?.id, categoryBrandHrefFromProduct]);

    const handleShare = async () => {
        if (typeof window === 'undefined') return;
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied');
        } catch {
            toast.error('Copy failed');
        }
    };

    const handleAddToCompare = () => {
        addToCompare({
            id: product.id,
            name: product.name,
            brand: product.brand?.name || '',
            price: displayPrice,
            oldPrice: displayOldPrice || null,
            discount: saveAmount > 0 ? `Save ${saveAmount.toLocaleString('en-IN')}` : null,
            imageUrl: (currentVariantImages && currentVariantImages[0]) || product.images?.[0] || '/no-image.svg',
        });
    };

    return (
        <div className="flex flex-col">
            {/* Header: brand + actions row, then full-width title */}
            <div className="mb-5">
                <div className="flex items-center justify-between gap-2 w-full min-w-0">
                    <div className="min-w-0 flex-1">
                        {matchedBrand?.name && (
                            brandListingHref ? (
                                <Link
                                    href={brandListingHref}
                                    className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0 max-w-full"
                                >
                                    {matchedBrand.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={matchedBrand.image}
                                            alt={matchedBrand.name}
                                            className="w-4 h-4 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <span className="w-4 h-4 shrink-0 rounded-full bg-gray-200" />
                                    )}
                                    <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tight truncate">
                                        {matchedBrand.name}
                                    </span>
                                </Link>
                            ) : matchedBrand.id ? (
                                <Link
                                    href={`/brand/${matchedBrand.id}`}
                                    className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0 max-w-full"
                                >
                                    {matchedBrand.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={matchedBrand.image}
                                            alt={matchedBrand.name}
                                            className="w-4 h-4 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <span className="w-4 h-4 shrink-0 rounded-full bg-gray-200" />
                                    )}
                                    <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tight truncate">
                                        {matchedBrand.name}
                                    </span>
                                </Link>
                            ) : (
                                <div className="inline-flex items-center gap-2 min-w-0 max-w-full">
                                    {matchedBrand.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={matchedBrand.image}
                                            alt={matchedBrand.name}
                                            className="w-4 h-4 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <span className="w-4 h-4 shrink-0 rounded-full bg-gray-200" />
                                    )}
                                    <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tight truncate">
                                        {matchedBrand.name}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCompare}
                            className="inline-flex items-center gap-1 px-1 py-1 text-[11px] sm:text-[13px] md:text-[14px] font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap font-[family-name:var(--font-outfit)]"
                        >
                            <FiShuffle size={15} className="shrink-0" />
                            Add to Compare
                        </button>
                        <button
                            type="button"
                            onClick={handleShare}
                            className="p-2 sm:p-2.5 bg-white text-gray-600 hover:text-gray-900 transition-colors shrink-0"
                            aria-label="Share product"
                        >
                            <FiShare2 size={16} />
                        </button>
                    </div>
                </div>
                <h1 className="mt-2.5 md:mt-3 text-[22px] md:text-[28px] font-semibold text-gray-800 tracking-tight leading-snug w-full">
                    {product.name}
                </h1>
            </div>

            {/* Price section */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg font-[family-name:var(--font-outfit)]">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="inline-flex items-baseline gap-0.5 text-[28px] md:text-[32px] font-bold text-gray-900 tracking-tight">
                        <span className="font-bold leading-none" style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}>৳</span>
                        <span>{displayPriceAmount}</span>
                    </span>
                    {displayOldPrice && (
                        <span className="inline-flex items-baseline gap-0.5 text-sm text-gray-400 line-through">
                            <span style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}>৳</span>
                            <span>{displayOldPriceAmount}</span>
                        </span>
                    )}
                    {product.hasDiscount && saveAmount > 0 && (
                        <span className="text-xs font-bold text-white bg-black px-2 py-0.5 rounded">Save {saveAmount.toLocaleString('en-IN')}</span>
                    )}
                </div>
                <p className="text-[12px] text-gray-500 mb-2">Price includes VAT</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 border-t border-gray-100 pt-2">
                    <span>Availability: <span className="font-semibold text-gray-800">In Stock</span></span>
                    <span className="text-gray-300">|</span>
                    <span>Code: <span className="font-semibold text-gray-800">{product.sku || 'N/A'}</span></span>
                </div>
            </div>

            {/* Used phone: prompt to configure below */}
            {hasVariants && isUsedPhoneProduct && (
                <div className="mb-6 space-y-3">
                    <button
                        type="button"
                        onClick={() => scrollToVariantSection('configure-device')}
                        className="group w-full rounded-2xl border border-[#ff8a00]/30 bg-gradient-to-br from-[#fff7ed] via-[#fef8ee] to-white p-4 md:p-5 text-left shadow-[0_8px_30px_-16px_rgba(255,138,0,0.35)] transition-all hover:border-[#ff8a00]/55 hover:shadow-[0_12px_36px_-14px_rgba(255,138,0,0.4)]"
                    >
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8a00] mb-1">
                                    Choose your device
                                </p>
                                <p className="text-base md:text-lg font-black text-gray-900 leading-snug mb-1">
                                    Select your preferred options
                                </p>
                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                    Scroll down to choose your color, storage, battery health, and region. The price will update automatically.
                                </p>
                            </div>
                            <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full bg-[#ff8a00] text-white shadow-md group-hover:scale-105 transition-transform">
                                <FiChevronDown className="animate-bounce" size={22} aria-hidden />
                            </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {configureSteps.map((step, index) => (
                                <span
                                    key={step.sectionId}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${
                                        step.done
                                            ? 'border-[#ff8a00] bg-[#ff8a00] text-white'
                                            : 'border-gray-200 bg-white/80 text-gray-600'
                                    }`}
                                >
                                    <span className="opacity-80">{index + 1}.</span>
                                    {step.label}
                                </span>
                            ))}
                        </div>

                        <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                                <span>Selection progress</span>
                                <span className="text-[#ff8a00]">{configureProgress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/90 border border-[#ff8a00]/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#ffb347] to-[#ff8a00] transition-all duration-500"
                                    style={{ width: `${configureProgress}%` }}
                                />
                            </div>
                        </div>

                        <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-[#ff8a00] group-hover:underline">
                            Jump to selection
                        </p>
                    </button>

                    {(selectedColor || selectedStorage || selectedBattery || selectedRegion) && (
                        <div className="flex flex-wrap gap-2">
                            {selectedColor && (
                                <button
                                    type="button"
                                    onClick={() => scrollToVariantSection('variant-color')}
                                    className="px-3 py-1.5 rounded-full text-xs font-black border border-[#ff8a00]/40 bg-white text-gray-900 hover:bg-[#fff7ed] transition-colors"
                                >
                                    {selectedColor}
                                </button>
                            )}
                            {selectedStorage && (
                                <button
                                    type="button"
                                    onClick={() => scrollToVariantSection('variant-storage')}
                                    className="px-3 py-1.5 rounded-full text-xs font-black border border-[#ff8a00]/40 bg-white text-gray-900 hover:bg-[#fff7ed] transition-colors"
                                >
                                    {selectedStorage}
                                </button>
                            )}
                            {selectedBattery && (
                                <button
                                    type="button"
                                    onClick={() => scrollToVariantSection('variant-battery')}
                                    className="px-3 py-1.5 rounded-full text-xs font-black border border-[#ff8a00]/40 bg-white text-gray-900 hover:bg-[#fff7ed] transition-colors"
                                >
                                    {formatBatteryLabel(selectedBattery)}
                                </button>
                            )}
                            {selectedRegion && (
                                <button
                                    type="button"
                                    onClick={() => scrollToVariantSection('variant-region')}
                                    className="px-3 py-1.5 rounded-full text-xs font-black border border-[#ff8a00]/40 bg-white text-gray-900 hover:bg-[#fff7ed] transition-colors"
                                >
                                    {selectedRegion}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {hasVariants && !isUsedPhoneProduct && (
                <div className="space-y-6 mb-6">

                    {/* Colors — use actual color swatches */}
                    {allColors.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest font-[family-name:var(--font-outfit)]">
                                Pick a Color: <span className="text-black">{selectedColor || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allColors.map(color => {
                                    const isSelected = selectedColor === color.name;
                                    const isWhite = color.hex?.toLowerCase() === '#ffffff' || color.hex?.toLowerCase() === '#fff';
                                    const selectedAccent = isWhite ? '#d1d5db' : color.hex || '#ff8a00';
                                    return (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-[6px] transition-all duration-200 font-[family-name:var(--font-outfit)] ${isSelected ? 'border-2 border-black bg-white' : 'border border-gray-200 bg-white hover:border-gray-400'}`}
                                            title={color.name}
                                        >
                                            <span className={`w-5 h-5 rounded-full ${isWhite ? 'border border-gray-200' : ''}`} style={{ backgroundColor: color.hex }} />
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-black' : 'text-gray-500'}`}>{color.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Model */}
                    {allModels.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest font-[family-name:var(--font-outfit)]">
                                Model: <span className="text-black">{selectedModel || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allModels.map(model => {
                                    const isAvailable = availableModels.includes(model);
                                    const isSelected = selectedModel === model;
                                    return (
                                        <button
                                            key={model}
                                            onClick={() => isAvailable && setSelectedModel(model)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-5 py-2.5 rounded-[6px] text-xs font-semibold uppercase tracking-widest transition-all duration-200 font-[family-name:var(--font-outfit)] ${isSelected ? 'border-2 border-black bg-white text-black' : isAvailable ? 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400' : 'border border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'}`}
                                        >
                                            {model}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Storage / Size */}
                    {allStorages.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest font-[family-name:var(--font-outfit)]">
                                Storage: <span className="text-black">{selectedStorage || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allStorages.map(size => {
                                    const isAvailable = availableStorages.includes(size);
                                    const isSelected = selectedStorage === size;
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => isAvailable && setSelectedStorage(size)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-5 py-2.5 rounded-[6px] text-xs font-semibold uppercase tracking-widest transition-all duration-200 font-[family-name:var(--font-outfit)] ${isSelected ? 'border-2 border-black bg-white text-black' : isAvailable ? 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400' : 'border border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'}`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Battery (used phones) */}
                    {isUsedPhoneProduct && allBatteries.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest font-[family-name:var(--font-outfit)]">
                                Battery: <span className="text-black">{formatBatteryLabel(selectedBattery) || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allBatteries.map(battery => {
                                    const isAvailable = availableBatteries.includes(battery);
                                    const isSelected = selectedBattery === battery;
                                    return (
                                        <button
                                            key={battery}
                                            type="button"
                                            onClick={() => isAvailable && setSelectedBattery(battery)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-5 py-2.5 rounded-[6px] text-xs font-semibold uppercase tracking-widest transition-all duration-200 font-[family-name:var(--font-outfit)] ${isSelected ? 'border-2 border-black bg-white text-black' : isAvailable ? 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400' : 'border border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'}`}
                                        >
                                            {formatBatteryLabel(battery)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Region */}
                    {allRegions.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest font-[family-name:var(--font-outfit)]">
                                Region: <span className="text-black">{selectedRegion || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allRegions.map(region => {
                                    const isAvailable = availableRegions.includes(region);
                                    const isSelected = selectedRegion === region;
                                    return (
                                        <button
                                            key={region}
                                            onClick={() => isAvailable && setSelectedRegion(region)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-5 py-2.5 rounded-[6px] text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 font-[family-name:var(--font-outfit)] ${isSelected ? 'border-2 border-black bg-white text-black' : isAvailable ? 'border border-gray-200 bg-white text-gray-500 hover:border-gray-400' : 'border border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'}`}
                                        >
                                            {region}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Price Benefits */}
            <div className="mb-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {/* Minimum Booking */}
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-3 font-[family-name:var(--font-outfit)]">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                            <FiCreditCard size={15} />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-500 leading-tight">Minimum Booking</p>
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">{pricingStats.minBooking.toLocaleString('en-IN')} BDT</p>
                        </div>
                    </div>

                    {/* Purchase Points */}
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-3 font-[family-name:var(--font-outfit)]">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                            <FiGift size={15} />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-500 leading-tight">Purchase Points</p>
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">{pricingStats.purchasePoints} Points</p>
                        </div>
                    </div>
                </div>

                {/* 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <button
                        type="button"
                        onClick={() => setSelectedPricingMode('offer')}
                        className={`flex items-center gap-4 text-left rounded-xl border-2 p-4 transition-all ${selectedPricingMode === 'offer'
                            ? 'border-[#3b82f6] bg-white shadow-md'
                            : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                            }`}
                    >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selectedPricingMode === 'offer'
                            ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]'
                            : 'border-gray-300 bg-white text-gray-300'
                            }`}>
                            {selectedPricingMode === 'offer' ? (
                                <div className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                            ) : (
                                <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                            )}
                        </div>
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 mb-0.5">Offer Price</p>
                            <p className={`text-[18px] md:text-[20px] font-black leading-tight ${selectedPricingMode === 'offer' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {pricingStats.offerPrice.toLocaleString('en-IN')} BDT
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Cash/Card/MFS Payment</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedPricingMode('regular')}
                        className={`flex items-center gap-4 text-left rounded-xl border-2 p-4 transition-all ${selectedPricingMode === 'regular'
                            ? 'border-[#3b82f6] bg-white shadow-md'
                            : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                            }`}
                    >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selectedPricingMode === 'regular'
                            ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]'
                            : 'border-gray-300 bg-white text-gray-300'
                            }`}>
                            {selectedPricingMode === 'regular' ? (
                                <div className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                            ) : (
                                <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                            )}
                        </div>
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 mb-0.5">Regular Price</p>
                            <p className={`text-[18px] md:text-[20px] font-black leading-tight ${selectedPricingMode === 'regular' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {pricingStats.regularPrice.toLocaleString('en-IN')} BDT
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                EMI starts at {pricingStats.emiMonthly.toLocaleString('en-IN')} BDT
                            </p>
                        </div>
                    </button>
                </div>
                */}
            </div>

            {/* Mobile-only Applex Care (below variant picker on used phones) */}
            <div className={`lg:hidden mb-10 ${hideMobileExtrasInInfo ? 'max-lg:hidden' : ''}`}>
                <ApplexCare 
                    product={product} 
                    currentPrice={currentPriceNumber}
                    selectedCarePlans={selectedCarePlans}
                    toggleCarePlan={toggleCarePlan}
                    openEmiTrigger={emiOpenTrigger}
                />
            </div>

            <ProductPurchaseBar
                product={product}
                variantSelection={variantSelection}
                selectedCarePlans={selectedCarePlans}
                displayPrice={displayPrice}
                className={`mt-4 ${hideMobileExtrasInInfo ? 'max-lg:hidden' : ''}`}
            />


            {/* Contact + Social row */}
            <div className="mt-3 flex items-center gap-3">
                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-gray-200 bg-[#dcfce7] text-gray-900 hover:text-[#25d366] hover:border-[#25d366]/40 transition-colors"
                    aria-label="WhatsApp"
                >
                    <FaWhatsapp size={20} />
                    <span className="text-sm font-bold">WhatsApp</span>
                </a>
                <div className="flex items-center gap-2">
                    <a
                        href="https://web.facebook.com/Applex.bd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-all duration-200 hover:border-[#ffb347] hover:bg-[#fff7ed]"
                        aria-label="Applex Facebook"
                    >
                        <Image
                            src="/product-details-svg/2023_Facebook_icon.svg"
                            alt="Facebook"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                        />
                    </a>
                    <a
                        href="https://www.tiktok.com/@applexofficialbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-all duration-200 hover:border-[#ffb347] hover:bg-[#fff7ed]"
                        aria-label="Applex TikTok"
                    >
                        <Image
                            src="/product-details-svg/tiktok-solo-icon.svg"
                            alt="TikTok"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                        />
                    </a>
                    <a
                        href="https://www.youtube.com/@user-lh5pe6ug2b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-all duration-200 hover:border-[#ffb347] hover:bg-[#fff7ed]"
                        aria-label="Applex YouTube"
                    >
                        <Image
                            src="/product-details-svg/youtube-color-icon.svg"
                            alt="YouTube"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}



