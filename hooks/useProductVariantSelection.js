'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

const DIMENSION_ORDER = ['color', 'model', 'storage', 'battery_life', 'region'];

const FIELD_BY_DIMENSION = {
    color: 'color',
    model: 'model',
    storage: 'storage',
    battery_life: 'battery_life',
    region: 'region',
};

export function formatBatteryLabel(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.toLowerCase().includes('brand new')) return 'Brand New';
    if (raw.includes('%')) return raw;
    if (/^\d+\s*-\s*\d+$/.test(raw)) return `${raw}%`;
    return raw;
}

export function getVariantListPriceNumber(matchedImei) {
    if (!matchedImei) return null;
    const raw = matchedImei.sale_price ?? matchedImei.price ?? matchedImei.discount_price;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
}

export function applyProductLevelDiscount(listPrice, product) {
    const base = Number(listPrice) || 0;
    if (!product?.hasDiscount) return base;
    const discountValue = Number(product.discountValue || 0);
    const discountType = String(product.discountType || '').toLowerCase();
    if (discountValue <= 0 || discountType === '0') return base;
    if (discountType === 'percentage') {
        return Math.max(0, Math.round(base * (1 - discountValue / 100)));
    }
    return Math.max(0, base - discountValue);
}

function isInStock(imei) {
    return imei && Number(imei.in_stock) === 1;
}

function buildPartialForOption(current, dimension, candidateValue) {
    const partial = {};
    for (const dim of DIMENSION_ORDER) {
        const field = FIELD_BY_DIMENSION[dim];
        if (dim === dimension) {
            if (candidateValue != null && candidateValue !== '') {
                partial[field] = candidateValue;
            }
            break;
        }
        const val = current[field];
        if (val != null && val !== '') {
            partial[field] = val;
        }
    }
    return partial;
}

function imeiMatchesPartial(imei, partial) {
    if (partial.color != null && partial.color !== '' && imei.color !== partial.color) return false;
    if (partial.model != null && partial.model !== '' && imei.model !== partial.model) return false;
    if (partial.storage != null && partial.storage !== '' && imei.storage !== partial.storage) return false;
    if (partial.battery_life != null && partial.battery_life !== '' && imei.battery_life !== partial.battery_life) return false;
    if (partial.region != null && partial.region !== '' && imei.region !== partial.region) return false;
    return true;
}

const normalizeTaka = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const raw = String(value).replace(/├á┬º┬│/g, '\u09F3').trim();
    if (!raw) return '';
    if (raw.startsWith('\u09F3')) return raw.replace(/^\u09F3\s*/, '\u09F3');
    const numericPart = raw.replace(/[^\d.,]/g, '');
    return numericPart ? `\u09F3${numericPart}` : raw;
};

export function useProductVariantSelection(product, { onVariantImageChange } = {}) {
    const imeis = product?.rawImeis || [];
    const hasVariants = imeis.length > 0;
    const normalizedProductCategorySlug = String(product?.category?.slug || '').toLowerCase();
    const normalizedProductCategoryName = String(product?.category?.name || '').toLowerCase();
    const isUsedPhoneProduct =
        normalizedProductCategorySlug === 'used-phone' ||
        normalizedProductCategoryName === 'used phone';

    const allColors = useMemo(() => {
        const colorMap = new Map();
        imeis.forEach((i) => {
            if (!i.color) return;
            const existing = colorMap.get(i.color);
            const image = i.image_path || existing?.image || null;
            colorMap.set(i.color, {
                name: i.color,
                hex: i.color_code || existing?.hex || '#e5e7eb',
                image,
            });
        });
        return Array.from(colorMap.values());
    }, [imeis]);

    const allModels = useMemo(
        () => [...new Set(imeis.map((i) => i.model).filter(Boolean))],
        [imeis]
    );

    const allStorages = useMemo(
        () => [...new Set(imeis.map((i) => i.storage).filter(Boolean))],
        [imeis]
    );

    const allRegions = useMemo(
        () => [...new Set(imeis.map((i) => i.region).filter(Boolean))],
        [imeis]
    );

    const allBatteries = useMemo(() => {
        if (!isUsedPhoneProduct) return [];
        return [...new Set(imeis.map((i) => i.battery_life).filter(Boolean))];
    }, [imeis, isUsedPhoneProduct]);

    const allBoxStatuses = useMemo(() => {
        if (!isUsedPhoneProduct) return [];
        return [...new Set(imeis.map((i) => i.box_status).filter(Boolean))];
    }, [imeis, isUsedPhoneProduct]);

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedBoxStatus, setSelectedBoxStatus] = useState(null);

    useEffect(() => {
        if (!product?.id) return;
        const firstColor = allColors[0]?.name || null;
        setSelectedColor(firstColor);
        setSelectedModel(null);
        setSelectedStorage(null);
        setSelectedBattery(null);
        setSelectedRegion(null);
        setSelectedBoxStatus(null);
    }, [product?.id, allColors]);

    useEffect(() => {
        if (!hasVariants) return;
        const matchingImeis = imeis.filter((i) => !selectedColor || i.color === selectedColor);
        const availableModels = [...new Set(matchingImeis.map((i) => i.model).filter(Boolean))];
        if (availableModels.length > 0) {
            if (!selectedModel || !availableModels.includes(selectedModel)) {
                setSelectedModel(availableModels[0]);
            }
        } else {
            setSelectedModel(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, product?.id]);

    useEffect(() => {
        if (!hasVariants) return;
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedModel && i.model) match = match && i.model === selectedModel;
            return match;
        });
        const availableStorages = [...new Set(matchingImeis.map((i) => i.storage).filter(Boolean))];
        if (availableStorages.length > 0) {
            if (!selectedStorage || !availableStorages.includes(selectedStorage)) {
                setSelectedStorage(availableStorages[0]);
            }
        } else {
            setSelectedStorage(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedModel, product?.id]);

    useEffect(() => {
        if (!hasVariants || !isUsedPhoneProduct) return;
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedModel && i.model) match = match && i.model === selectedModel;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });
        const availableBatteries = [...new Set(matchingImeis.map((i) => i.battery_life).filter(Boolean))];
        if (availableBatteries.length > 0) {
            if (!selectedBattery || !availableBatteries.includes(selectedBattery)) {
                setSelectedBattery(availableBatteries[0]);
            }
        } else {
            setSelectedBattery(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedModel, selectedStorage, isUsedPhoneProduct, product?.id]);

    useEffect(() => {
        if (!hasVariants) return;
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedModel && i.model) match = match && i.model === selectedModel;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            if (isUsedPhoneProduct && selectedBattery && i.battery_life) {
                match = match && i.battery_life === selectedBattery;
            }
            return match;
        });
        const availableRegions = [...new Set(matchingImeis.map((i) => i.region).filter(Boolean))];
        if (availableRegions.length > 0) {
            if (!selectedRegion || !availableRegions.includes(selectedRegion)) {
                setSelectedRegion(availableRegions[0]);
            }
        } else {
            setSelectedRegion(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedModel, selectedStorage, selectedBattery, isUsedPhoneProduct, product?.id]);

    const currentSelection = useMemo(
        () => ({
            color: selectedColor,
            model: selectedModel,
            storage: selectedStorage,
            battery_life: selectedBattery,
            region: selectedRegion,
        }),
        [selectedColor, selectedModel, selectedStorage, selectedBattery, selectedRegion]
    );

    const availableModels = useMemo(() => {
        const matchingImeis = imeis.filter((i) => !selectedColor || i.color === selectedColor);
        return [...new Set(matchingImeis.map((i) => i.model).filter(Boolean))];
    }, [imeis, selectedColor]);

    const availableStorages = useMemo(() => {
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedModel && i.model) match = match && i.model === selectedModel;
            return match;
        });
        return [...new Set(matchingImeis.map((i) => i.storage).filter(Boolean))];
    }, [imeis, selectedColor, selectedModel]);

    const availableBatteries = useMemo(() => {
        if (!isUsedPhoneProduct) return [];
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedModel && i.model) match = match && i.model === selectedModel;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });
        return [...new Set(matchingImeis.map((i) => i.battery_life).filter(Boolean))];
    }, [imeis, selectedColor, selectedModel, selectedStorage, isUsedPhoneProduct]);

    const availableRegions = useMemo(() => {
        const matchingImeis = imeis.filter((i) => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedModel && i.model) match = match && i.model === selectedModel;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            if (isUsedPhoneProduct && selectedBattery && i.battery_life) {
                match = match && i.battery_life === selectedBattery;
            }
            return match;
        });
        return [...new Set(matchingImeis.map((i) => i.region).filter(Boolean))];
    }, [imeis, selectedColor, selectedModel, selectedStorage, selectedBattery, isUsedPhoneProduct]);

    const imeiMatchesSelection = useCallback(
        (i, { requireRegion = true } = {}) => {
            if (selectedColor && i.color !== selectedColor) return false;
            if (selectedModel && i.model !== selectedModel) return false;
            if (selectedStorage && i.storage !== selectedStorage) return false;
            if (isUsedPhoneProduct && selectedBattery && i.battery_life !== selectedBattery) return false;
            if (requireRegion && selectedRegion && i.region !== selectedRegion) return false;
            return true;
        },
        [selectedColor, selectedModel, selectedStorage, selectedBattery, selectedRegion, isUsedPhoneProduct]
    );

    const matchedImei = useMemo(() => {
        if (!hasVariants) return null;
        let match = imeis.find((i) => imeiMatchesSelection(i, { requireRegion: true }));
        if (!match) match = imeis.find((i) => imeiMatchesSelection(i, { requireRegion: false }));
        if (!match) {
            match = imeis.find(
                (i) =>
                    (!selectedColor || i.color === selectedColor) &&
                    (!selectedStorage || i.storage === selectedStorage)
            );
        }
        if (!match) {
            match = imeis.find((i) => !selectedColor || i.color === selectedColor);
        }
        return match;
    }, [imeis, selectedColor, selectedStorage, selectedBattery, selectedRegion, hasVariants, imeiMatchesSelection]);

    const variantListPriceNumber = useMemo(
        () => getVariantListPriceNumber(matchedImei),
        [matchedImei]
    );

    const currentPriceNumber = useMemo(() => {
        if (variantListPriceNumber != null) {
            return applyProductLevelDiscount(variantListPriceNumber, product);
        }
        return Number(product?.rawPrice) || 0;
    }, [variantListPriceNumber, product]);

    const displayPrice = useMemo(
        () => normalizeTaka(`\u09F3${Math.round(currentPriceNumber).toLocaleString('en-IN')}`),
        [currentPriceNumber]
    );

    const displayOldPrice = useMemo(() => {
        if (variantListPriceNumber != null) {
            if (product?.hasDiscount && currentPriceNumber < variantListPriceNumber) {
                return normalizeTaka(`\u09F3${variantListPriceNumber.toLocaleString('en-IN')}`);
            }
            if (product?.hasDiscount && Number(product?.originalPrice || 0) > variantListPriceNumber) {
                return normalizeTaka(`\u09F3${Number(product.originalPrice).toLocaleString('en-IN')}`);
            }
        }
        return normalizeTaka(product?.oldPrice);
    }, [variantListPriceNumber, currentPriceNumber, product]);

    const displayPriceAmount = useMemo(
        () => String(displayPrice || '').replace(/^\u09F3\s*/, ''),
        [displayPrice]
    );

    const displayOldPriceAmount = useMemo(
        () => String(displayOldPrice || '').replace(/^\u09F3\s*/, ''),
        [displayOldPrice]
    );

    const currentVariantImages = useMemo(() => {
        if (!hasVariants || !selectedColor) return null;
        const colorImeis = imeis.filter((i) => i.color === selectedColor && i.image_path);
        return [...new Set(colorImeis.map((i) => i.image_path))].filter(Boolean);
    }, [hasVariants, selectedColor, imeis]);

    useEffect(() => {
        if (!onVariantImageChange || !hasVariants) return;
        if (currentVariantImages && currentVariantImages.length > 0) {
            onVariantImageChange(currentVariantImages);
        } else {
            onVariantImageChange(null);
        }
    }, [currentVariantImages, onVariantImageChange, hasVariants]);

    const isOptionAvailable = useCallback(
        (dimension, value) => {
            const partial = buildPartialForOption(currentSelection, dimension, value);
            return imeis.some((i) => isInStock(i) && imeiMatchesPartial(i, partial));
        },
        [imeis, currentSelection]
    );

    const getOptionPrice = useCallback(
        (dimension, value) => {
            const partial = buildPartialForOption(currentSelection, dimension, value);
            const prices = imeis
                .filter((i) => isInStock(i) && imeiMatchesPartial(i, partial))
                .map((i) => {
                    const list = getVariantListPriceNumber(i);
                    return list != null ? applyProductLevelDiscount(list, product) : null;
                })
                .filter((p) => p != null && p > 0);
            if (prices.length === 0) return null;
            return Math.min(...prices);
        },
        [imeis, currentSelection, product]
    );

    const formatOptionPrice = useCallback(
        (dimension, value) => {
            const price = getOptionPrice(dimension, value);
            if (price == null) return null;
            return `\u09F3${Math.round(price).toLocaleString('en-IN')}`;
        },
        [getOptionPrice]
    );

    const configSummaryParts = useMemo(() => {
        const parts = [];
        if (selectedModel) parts.push(selectedModel);
        if (selectedStorage) parts.push(selectedStorage);
        if (selectedColor) parts.push(selectedColor);
        if (isUsedPhoneProduct && selectedBattery) parts.push(formatBatteryLabel(selectedBattery));
        if (selectedRegion) parts.push(selectedRegion);
        return parts;
    }, [selectedModel, selectedStorage, selectedColor, selectedBattery, selectedRegion, isUsedPhoneProduct]);

    const configSummaryLabel = configSummaryParts.join(' - ');

    const getCartPayloadAndVariants = useCallback(
        (options = {}) => {
            const {
                quantity = 1,
                selectedCarePlans = [],
                selectedPricingMode = 'offer',
                pricingStats = {},
            } = options;

            const variants = {};
            if (selectedModel) variants.model = selectedModel;
            if (selectedStorage) variants.storage = selectedStorage;
            if (selectedColor) {
                variants.colors = {
                    name: selectedColor,
                    hex: allColors.find((c) => c.name === selectedColor)?.hex,
                };
            }
            if (selectedBattery) variants.battery = selectedBattery;
            if (selectedRegion) variants.region = selectedRegion;
            variants.paymentPlan = selectedPricingMode;

            const selectedCheckoutPrice =
                selectedPricingMode === 'regular' ? pricingStats.regularPrice : pricingStats.offerPrice;

            const currentImageUrl =
                currentVariantImages && currentVariantImages.length > 0
                    ? currentVariantImages[0]
                    : product?.images?.[0] || null;

            return {
                cartProduct: {
                    ...product,
                    price: `\u09F3${selectedCheckoutPrice?.toLocaleString('en-IN')}`,
                    rawPrice: selectedCheckoutPrice,
                    imageUrl: currentImageUrl,
                    carePlans: selectedCarePlans,
                    selectedPricingMode,
                    emiMonthly: pricingStats.emiMonthly,
                },
                cartVariants: Object.keys(variants).length > 0 ? variants : null,
            };
        },
        [
            selectedModel,
            selectedStorage,
            selectedColor,
            selectedBattery,
            selectedRegion,
            allColors,
            currentVariantImages,
            product,
        ]
    );

    const scrollToVariantSection = useCallback((sectionId) => {
        if (typeof document === 'undefined') return;
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return {
        hasVariants,
        isUsedPhoneProduct,
        allColors,
        allModels,
        allStorages,
        allBatteries,
        allRegions,
        allBoxStatuses,
        availableModels,
        availableStorages,
        availableBatteries,
        availableRegions,
        selectedColor,
        setSelectedColor,
        selectedModel,
        setSelectedModel,
        selectedStorage,
        setSelectedStorage,
        selectedBattery,
        setSelectedBattery,
        selectedRegion,
        setSelectedRegion,
        selectedBoxStatus,
        setSelectedBoxStatus,
        matchedImei,
        variantListPriceNumber,
        currentPriceNumber,
        displayPrice,
        displayOldPrice,
        displayPriceAmount,
        displayOldPriceAmount,
        currentVariantImages,
        formatBatteryLabel,
        isOptionAvailable,
        getOptionPrice,
        formatOptionPrice,
        configSummaryLabel,
        configSummaryParts,
        getCartPayloadAndVariants,
        scrollToVariantSection,
    };
}
