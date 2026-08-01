import Hero from "../components/Hero/Hero";
import ShopCategories from "../components/ShopCategories/ShopCategories";
import NewArrivals from "../components/NewArrivals/NewArrivals";
import PromoBanners from "../components/PromoBanners/PromoBanners";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import BestDeals from "../components/BestDeals/BestDeals";
import BrandsMarquee from "../components/Brands/BrandsMarquee";
import BlogTips from "../components/BlogTips/BlogTips";
import UsedPhones from "../components/UsedPhones/UsedPhones";

import {
  getSlidersFromServer,
  getCategoriesFromServer,
  getNewArrivalsFromServer,
  getBlogs,
  getBannerFromServer,
  getBestDealsFromServer,
  getBestSellersFromServer,
  getTopBrands,
  getUsedPhonesFromServer
} from "../lib/api";
import {
  extractDataArray,
  normalizeBannerResponse,
  splitBannersForHome,
} from "../lib/banners";

export default async function Home() {
  // Fetch API Data safely
  const [
    slidersRes,
    bannersRes,
    categoriesRes,
    newArrivalsRes,
    bestSellersRes,
    bestDealsRes,
    usedPhonesRes,
    blogsRes,
    brandsRes
  ] = await Promise.all([
    getSlidersFromServer().catch(() => ({ success: false, data: [] })),
    getBannerFromServer().catch(() => ({ success: false, data: [] })),
    getCategoriesFromServer().catch(() => ({ success: false, data: [] })),
    getNewArrivalsFromServer().catch(() => ({ success: false, data: [] })),
    getBestSellersFromServer().catch(() => ({ success: false, data: [] })),
    getBestDealsFromServer().catch(() => ({ success: false, data: [] })),
    getUsedPhonesFromServer().catch(() => ({ success: false, data: [] })),
    getBlogs().catch(() => ({ success: false, data: [] })),
    getTopBrands().catch(() => ({ success: false, data: [] }))
  ]);

  // ═══════════════════════════════════════════
  // API DATA MAPPING
  // ═══════════════════════════════════════════

  const mapProductData = (p) => {
    const basePrice = Number(p.retails_price || p.price || 0);
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

    // Prioritize image_path or image_paths[0] for real products, fallback to image_url (which might be a placeholder)
    let imageUrl =
      p.image_path ||
      (Array.isArray(p.image_paths) && p.image_paths.length > 0 ? p.image_paths[0] : null) ||
      p.image_url ||
      '/no-image.svg';

    if (typeof imageUrl === 'string') {
      imageUrl = imageUrl.trim();
    }

    const mapped = {
      id: p.id,
      name: p.name,
      price: `৳ ${price.toLocaleString('en-IN')}`,
      oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
      discount: discountLabel,
      imageUrl: imageUrl,
      brand: p.brands?.name || p.brand_name || '',
      categoryName: p.category_name || 'Others',
      hasVariants: p.have_variant === 1 || (Array.isArray(p.imeis) && p.imeis.length > 0),
    };

    // Also inject properties specifically needed by BestDeals component to prevent "missing alt" errors
    mapped.title = mapped.name;
    mapped.description = `${mapped.brand} • ${mapped.categoryName}`;
    mapped.badge = hasDiscount ? 'SALE' : null;
    mapped.link = `/product/${mapped.name.toLowerCase().replace(/\s+/g, '-')}-${mapped.id}`;
    if (hasDiscount) {
      mapped.savings = `Save ৳ ${(basePrice - price).toLocaleString('en-IN')}`;
    }

    return mapped;
  };

  const mapCategoryData = (c) => {
    const rawImage = c.image_url || c.image_path || c.image || '/no-image.svg';
    return {
      ...c,
      image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
    };
  };

  const mapSliderData = (s) => {
    if (Array.isArray(s.image_path) && s.image_path.length > 0) {
      return s.image_path.map((imgUrl, idx) => ({
        id: `${s.id}-${idx}`,
        image: typeof imgUrl === 'string' ? imgUrl.trim() : (imgUrl || '/no-image.svg'),
        title: s.title || s.name || 'Featured Item',
        subtitle: s.subtitle || s.description || 'Discover our top picks',
        link: s.link || '#',
      }));
    }
    const rawImage = s.image_url || s.image_path || s.image || '/no-image.svg';
    return [{
      id: s.id,
      image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
      title: s.title || s.name || 'Featured Item',
      subtitle: s.subtitle || s.description || 'Discover our top picks',
      link: s.link || '#',
    }];
  };

  const mapBrandData = (b) => {
    const rawImage = b.image_path || b.image || "/no-image.svg";
    return {
      id: b.id,
      name: b.name || "Brand",
      image: typeof rawImage === "string" ? rawImage.trim() : rawImage,
    };
  };

  const extractDataArrayLocal = extractDataArray;

  // Extract data from response or default to null
  const rawSliders = extractDataArrayLocal(slidersRes, 'sliders');
  const apiSliders = rawSliders ? rawSliders.flatMap(mapSliderData) : null;

  const apiBanners = normalizeBannerResponse(bannersRes);
  const { heroSide: heroSideBanners, midPromo: midPromoBanners, bottomPromo: bottomPromoBanners } =
    splitBannersForHome(apiBanners);

  const rawCategories = extractDataArrayLocal(categoriesRes);
  const apiCategories = rawCategories ? rawCategories.map(mapCategoryData) : null;

  const rawNewArrivals = extractDataArrayLocal(newArrivalsRes);
  const apiNewArrivals = rawNewArrivals ? rawNewArrivals.map(mapProductData) : null;

  const rawBestSellers = extractDataArrayLocal(bestSellersRes);
  const apiBestSellers = rawBestSellers ? rawBestSellers.map(mapProductData) : null;

  const rawBestDeals = extractDataArrayLocal(bestDealsRes);
  const apiBestDeals = rawBestDeals ? rawBestDeals.map(mapProductData) : null;

  const rawUsedPhones = extractDataArrayLocal(usedPhonesRes);
  const apiUsedPhones = rawUsedPhones ? rawUsedPhones.map(mapProductData) : null;

  const rawBrands = extractDataArrayLocal(brandsRes);
  const apiBrands = rawBrands ? rawBrands.map(mapBrandData) : [];

  const blogsDataArray = Array.isArray(blogsRes?.data) ? blogsRes.data : (blogsRes?.data?.data || []);
  const apiBlogs = blogsDataArray.length > 0 ? blogsDataArray.map(b => {
    const rawImage = b.image || "/no-image.svg";
    return {
      id: b.id,
      title: b.title,
      image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
    };
  }) : [];

  // Flash sale strip: use best deals first, else first 4 of new arrivals (API only)
  const flashSaleProducts = (apiBestDeals && apiBestDeals.length > 0)
    ? apiBestDeals.slice(0, 4)
    : (apiNewArrivals && apiNewArrivals.length > 0 ? apiNewArrivals.slice(0, 4) : []);

  return (
    <div className="bg-transparent">
      <Hero slides={apiSliders ?? []} banners={heroSideBanners} />
      <ShopCategories categories={apiCategories ?? []} flashSaleProducts={flashSaleProducts} />
      <BrandsMarquee brands={apiBrands} />
      <PromoBanners banners={midPromoBanners} />
      <UsedPhones products={apiUsedPhones ?? []} />
      <BestDeals deals={apiBestDeals ?? []} />
      <NewArrivals products={apiNewArrivals ?? []} />

      <PromoBanners banners={bottomPromoBanners} />
      <FeaturedProducts
        bestSellers={apiBestSellers ?? []}
        newArrivals={apiNewArrivals ?? []}
        flashDeals={apiBestDeals ?? []}
      />
    </div>
  );
}
