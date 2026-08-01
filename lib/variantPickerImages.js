/**
 * Large hero photos shown beside each variant section (Back Market style).
 * Color uses live product photos from IMEI data; other sections use stock imagery.
 */

/** Section hero images in /public */
export const VARIANT_SECTION_HERO = {
    storage: '/storgae.png',
    battery: '/battary.png',
    region: '/region.png',
};

export function getColorSectionHeroImage(selectedColor, allColors, productFallbackImage) {
    if (selectedColor && allColors?.length) {
        const match = allColors.find((c) => c.name === selectedColor);
        if (match?.image) return match.image;
    }
    if (allColors?.[0]?.image) return allColors[0].image;
    return productFallbackImage || null;
}

export function getStorageSectionHeroImage(_productFallbackImage) {
    return VARIANT_SECTION_HERO.storage;
}

export function getBatterySectionHeroImage(_productFallbackImage) {
    return VARIANT_SECTION_HERO.battery;
}

export function getRegionSectionHeroImage(_productFallbackImage) {
    return VARIANT_SECTION_HERO.region;
}
