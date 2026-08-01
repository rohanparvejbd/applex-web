/** Map API product payload to PremiumProductCard shape */
export function mapApiProductToCard(p) {
    if (!p) return null;

    const basePrice = Number(p.retails_price || p.discounted_price || p.price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = String(p.discount_type || '').toLowerCase();
    const hasDiscount = discountValue > 0 && discountType !== '0';

    const price = hasDiscount
        ? discountType === 'percentage'
            ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
            : Math.max(0, basePrice - discountValue)
        : basePrice;

    const discountLabel = hasDiscount
        ? discountType === 'percentage'
            ? `-${discountValue}%`
            : `৳ ${discountValue.toLocaleString('en-IN')}`
        : null;

    const imageUrl =
        p.image_path ||
        p.image_path1 ||
        p.image_path2 ||
        (Array.isArray(p.image_paths) && p.image_paths[0]) ||
        p.image_url ||
        '/no-image.svg';

    return {
        id: p.id,
        name: p.name,
        price: `৳ ${price.toLocaleString('en-IN')}`,
        oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
        discount: discountLabel,
        imageUrl: imageUrl?.toString().trim(),
        brand: p.brands?.name || p.brand_name || '',
        categoryName: p.category?.name || p.category_name || 'Others',
        raw: p,
    };
}

export function extractProductList(res) {
    const payload = res?.data ?? res;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
}
