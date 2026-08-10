'use client';

import Image from 'next/image';
import { formatBatteryLabel } from '../../hooks/useProductVariantSelection';
import {
    getColorSectionHeroImage,
    getStorageSectionHeroImage,
    getBatterySectionHeroImage,
    getRegionSectionHeroImage,
} from '../../lib/variantPickerImages';
import ProductPurchaseBar from './ProductPurchaseBar';
import ProductMobileCareAndShipping from './ProductMobileCareAndShipping';
import UsedPhoneVariantGrid from './UsedPhoneVariantGrid';

const SECTION_META = {
    'variant-color': { step: 1, tag: 'Appearance' },
    'variant-storage': { step: 2, tag: 'Capacity' },
    'variant-battery': { step: 3, tag: 'Condition' },
    'variant-region': { step: 4, tag: 'Origin' },
};

function VariantOptionCard({ label, priceText, selected, disabled, onSelect, swatchHex }) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => !disabled && onSelect()}
            className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                selected
                    ? 'border-[#ff8a00] bg-[#fff7ed] shadow-[0_8px_24px_-12px_rgba(255,138,0,0.45)] ring-1 ring-[#ff8a00]/30'
                    : disabled
                        ? 'border-gray-100 bg-gray-50/80 cursor-not-allowed opacity-60'
                        : 'border-gray-200/90 bg-white hover:border-[#ffb347] hover:bg-[#fffbf5] hover:shadow-sm'
            }`}
        >
            <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    selected
                        ? 'border-[#ff8a00] bg-[#ff8a00]'
                        : disabled
                            ? 'border-gray-200 bg-white'
                            : 'border-gray-300 bg-white group-hover:border-[#ffb347]'
                }`}
                aria-hidden
            >
                {selected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
            </span>

            <span className="flex flex-1 min-w-0 items-center gap-2.5">
                {swatchHex && (
                    <span
                        className={`inline-block h-5 w-5 shrink-0 rounded-full ring-2 ring-white shadow-sm ${
                            swatchHex?.toLowerCase() === '#ffffff' || swatchHex?.toLowerCase() === '#fff'
                                ? 'border border-gray-200'
                                : ''
                        }`}
                        style={{ backgroundColor: swatchHex }}
                        aria-hidden
                    />
                )}
                <span
                    className={`text-sm md:text-[15px] font-bold truncate ${
                        disabled ? 'text-gray-400' : selected ? 'text-gray-900' : 'text-gray-700'
                    }`}
                >
                    {label}
                </span>
            </span>

            <span className="shrink-0 text-right pl-2">
                {disabled ? (
                    <span className="text-[11px] font-black uppercase tracking-wide text-gray-400">
                        Sold out
                    </span>
                ) : priceText ? (
                    <span
                        className={`text-sm md:text-[15px] font-black inline-flex items-baseline gap-0.5 ${
                            selected ? 'text-[#ff8a00]' : 'text-gray-900'
                        }`}
                        style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                    >
                        <span>৳</span>
                        <span>{String(priceText).replace(/^\u09F3\s*/, '').replace(/^৳\s*/, '')}</span>
                    </span>
                ) : null}
            </span>
        </button>
    );
}

function SectionHeroImage({ src, alt, step }) {
    const frame = (
        <div className="relative w-full max-w-[200px] md:max-w-[220px] mx-auto lg:mx-0">
            <div
                className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#ff8a00]/15 via-[#fef8ee] to-[#fff7ed] -rotate-2"
                aria-hidden
            />
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_16px_40px_-16px_rgba(15,23,42,0.2)] ring-1 ring-black/5 bg-[#f3f0ff]">
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        unoptimized
                        className="object-cover object-center"
                        sizes="220px"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#fef8ee]" />
                )}
            </div>
            {step != null && (
                <span className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff8a00] text-white text-xs font-black shadow-md">
                    {step}
                </span>
            )}
        </div>
    );

    return frame;
}

function VariantSection({ id, title, heroImage, heroAlt, step, tag, children }) {
    return (
        <section
            id={id}
            className="scroll-mt-32 md:scroll-mt-[15rem]"
            aria-labelledby={`${id}-title`}
        >
            <div className="rounded-2xl border border-gray-100/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,220px)_1fr] gap-0 md:gap-0">
                    {/* Image panel */}
                    <div className="relative bg-gradient-to-br from-[#fef8ee] via-[#fff7ed] to-white px-5 py-6 md:py-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100/80 overflow-hidden">
                        <SectionHeroImage src={heroImage} alt={heroAlt} step={step} />
                    </div>

                    {/* Options panel */}
                    <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8">
                        <div className="mb-4 md:mb-5">
                            {tag && (
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8a00] mb-1">
                                    {tag}
                                </p>
                            )}
                            <h2
                                id={`${id}-title`}
                                className="text-xl md:text-2xl font-black text-gray-900 tracking-tight"
                            >
                                {title}
                            </h2>
                        </div>
                        <div
                            role="radiogroup"
                            aria-labelledby={`${id}-title`}
                            className="flex flex-col gap-2.5"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function UsedPhoneVariantPicker({
    product,
    selectedCarePlans = [],
    toggleCarePlan,
    emiOpenTrigger = 0,
    allColors,
    allStorages,
    allBatteries,
    allRegions,
    selectedColor,
    setSelectedColor,
    selectedStorage,
    setSelectedStorage,
    selectedBattery,
    setSelectedBattery,
    selectedRegion,
    setSelectedRegion,
    formatOptionPrice,
    isOptionAvailable,
    formatBatteryLabel: formatBatteryLabelProp,
    configSummaryLabel,
    displayPrice,
    currentVariantImages,
    getCartPayloadAndVariants,
    currentPriceNumber,
}) {
    const formatBattery = formatBatteryLabelProp || formatBatteryLabel;
    const productFallbackImage = product?.images?.[0] || '/no-image.svg';
    const thumbnail =
        (currentVariantImages && currentVariantImages[0]) ||
        productFallbackImage;

    const colorHero = getColorSectionHeroImage(selectedColor, allColors, productFallbackImage);
    const storageHero = getStorageSectionHeroImage(productFallbackImage);
    const batteryHero = getBatterySectionHeroImage(productFallbackImage);
    const regionHero = getRegionSectionHeroImage(productFallbackImage);

    const sections = [
        {
            id: 'variant-color',
            title: 'Select color',
            heroImage: colorHero,
            heroAlt: selectedColor ? `${selectedColor} ${product?.name || 'phone'}` : 'Select phone color',
            show: allColors?.length > 0,
            render: () =>
                allColors.map((color) => {
                    const available = isOptionAvailable('color', color.name);
                    const price = formatOptionPrice('color', color.name);
                    return (
                        <VariantOptionCard
                            key={color.name}
                            label={color.name}
                            swatchHex={color.hex}
                            priceText={price}
                            selected={selectedColor === color.name}
                            disabled={!available}
                            onSelect={() => setSelectedColor(color.name)}
                        />
                    );
                }),
        },
        {
            id: 'variant-storage',
            title: 'Select storage',
            heroImage: storageHero,
            heroAlt: 'Choose storage capacity',
            show: allStorages?.length > 0,
            render: () =>
                allStorages.map((storage) => {
                    const available = isOptionAvailable('storage', storage);
                    const price = formatOptionPrice('storage', storage);
                    return (
                        <VariantOptionCard
                            key={storage}
                            label={storage}
                            priceText={price}
                            selected={selectedStorage === storage}
                            disabled={!available}
                            onSelect={() => setSelectedStorage(storage)}
                        />
                    );
                }),
        },
        {
            id: 'variant-battery',
            title: 'Select battery health',
            heroImage: batteryHero,
            heroAlt: 'Choose battery health',
            show: allBatteries?.length > 0,
            render: () =>
                allBatteries.map((battery) => {
                    const available = isOptionAvailable('battery_life', battery);
                    const price = formatOptionPrice('battery_life', battery);
                    return (
                        <VariantOptionCard
                            key={battery}
                            label={formatBattery(battery)}
                            priceText={price}
                            selected={selectedBattery === battery}
                            disabled={!available}
                            onSelect={() => setSelectedBattery(battery)}
                        />
                    );
                }),
        },
        {
            id: 'variant-region',
            title: 'Select region',
            heroImage: regionHero,
            heroAlt: 'Choose region',
            show: allRegions?.length > 0,
            render: () =>
                allRegions.map((region) => {
                    const available = isOptionAvailable('region', region);
                    const price = formatOptionPrice('region', region);
                    return (
                        <VariantOptionCard
                            key={region}
                            label={region}
                            priceText={price}
                            selected={selectedRegion === region}
                            disabled={!available}
                            onSelect={() => setSelectedRegion(region)}
                        />
                    );
                }),
        },
    ].filter((s) => s.show);

    return (
        <div
            id="configure-device"
            className="mt-8 md:mt-10 w-full max-w-full overflow-x-clip border-t border-gray-100 scroll-mt-32 md:scroll-mt-[15rem]"
        >
            <div className="max-w-[1248px] mx-auto px-3 sm:px-4 md:px-0 py-6 md:py-8 min-w-0">

                <div className="flex flex-col gap-4 md:gap-5">
                    <UsedPhoneVariantGrid
                        product={product}
                        variantSelection={{
                            formatBatteryLabel: formatBattery,
                            setSelectedColor,
                            setSelectedStorage,
                            setSelectedBattery,
                            setSelectedRegion,
                            getCartPayloadAndVariants,
                            scrollToVariantSection: () => {
                                if (typeof document !== 'undefined') {
                                    document.getElementById('ready-to-order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }
                        }}
                    />
                </div>

                <ProductMobileCareAndShipping
                    product={product}
                    currentPriceNumber={currentPriceNumber}
                    selectedCarePlans={selectedCarePlans}
                    toggleCarePlan={toggleCarePlan}
                    emiOpenTrigger={emiOpenTrigger}
                    showShipping={false}
                    className="mt-6 md:mt-8"
                />

                <ProductMobileCareAndShipping
                    product={product}
                    currentPriceNumber={currentPriceNumber}
                    selectedCarePlans={selectedCarePlans}
                    toggleCarePlan={toggleCarePlan}
                    emiOpenTrigger={emiOpenTrigger}
                    showCare={false}
                    className="mt-6 md:mt-8"
                />
            </div>
        </div>
    );
}

