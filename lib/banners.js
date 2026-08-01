/**
 * Shared banner normalization and placement helpers.
 */

export function extractDataArray(res, specificKey) {
    if (!res) return null;

    if (specificKey && Array.isArray(res[specificKey]) && res[specificKey].length > 0) {
        return res[specificKey];
    }

    if (Array.isArray(res) && res.length > 0) {
        return res;
    }

    if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
    }

    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
    }

    if (
        res.data &&
        res.data.data &&
        Array.isArray(res.data.data.data) &&
        res.data.data.data.length > 0
    ) {
        return res.data.data.data;
    }

    return null;
}

export function mapBannerFromApi(b) {
    if (!b) return null;
    const rawImage = b.image_path || b.image_url || b.image || '/no-image.svg';
    return {
        ...b,
        id: b.id,
        title: b.title || '',
        description: b.description || '',
        image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
        link: b.button_url || b.link || '/',
        buttonText: b.button_text || 'Shop Now',
        backgroundColor: b.background_color || null,
        type: b.type || null,
        status: b.status,
    };
}

export function normalizeBannerResponse(res) {
    const raw = extractDataArray(res, 'banners');
    if (!raw || raw.length === 0) return [];
    return raw.map(mapBannerFromApi).filter(Boolean);
}

export function getActiveBanners(banners) {
    return (Array.isArray(banners) ? banners : []).filter(
        (b) => b && Number(b.status) === 1
    );
}

export function splitBannersForHome(banners) {
    const active = getActiveBanners(banners);
    return {
        heroSide: active.slice(0, 3),
        midPromo: active.slice(3, 4),
        bottomPromo: active.slice(4, 6),
        overflow: active.slice(6),
    };
}

export function findBannerForCategory(banners, slug) {
    if (!slug || !Array.isArray(banners)) return null;
    const normalizedSlug = String(slug).toLowerCase().trim();
    const categoryPath = `/category/${normalizedSlug}`;

    return (
        banners.find((b) => {
            const link = String(b.link || b.button_url || '').toLowerCase();
            return link.includes(categoryPath);
        }) || null
    );
}
