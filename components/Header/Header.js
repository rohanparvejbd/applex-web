"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight, FiChevronUp, FiChevronDown, FiHeadphones, FiTruck, FiFileText, FiCopy, FiZap, FiInfo, FiGrid, FiBatteryCharging, FiMonitor, FiCreditCard, FiSmartphone, FiMic, FiShuffle } from 'react-icons/fi';
import { FaApple, FaAndroid, FaTabletAlt, FaLaptop, FaClock } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useBrandCache } from '../../context/BrandCacheContext';
import { searchProducts } from '../../lib/api';
import { mapApiProductToCard } from '../../lib/mapProductCard';
import {
  useSearchDropdownFeed,
  SEARCH_FEED_COLS,
  SEARCH_FEED_SCROLL_ROWS,
} from '../../hooks/useSearchDropdownFeed';
import ProductCard from '../Shared/PremiumProductCard';

export default function Header({ categories = [] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [liveCategories, setLiveCategories] = useState(Array.isArray(categories) ? categories : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [activeSearchCategory, setActiveSearchCategory] = useState('all');

  const showDesktopProductFeed = isSearchOpen && !searchQuery.trim();
  const {
    products: feedProducts,
    isLoading: isFeedLoading,
    isLoadingMore: isFeedLoadingMore,
    hasMore: feedHasMore,
    loadMore: loadMoreFeed,
  } = useSearchDropdownFeed(liveCategories, showDesktopProductFeed);

  const feedScrollRef = useRef(null);
  const feedSentinelRef = useRef(null);


  const { cartCount, cartTotal, openCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { getBrandsForCategory, isFetchingBrands } = useBrandCache();
  const router = useRouter();

  const searchContainerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const [showTopStrip, setShowTopStrip] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY <= 10) {
        setShowTopStrip(true);
      } else if (scrollY > 80) {
        setShowTopStrip(false);
      }
    };

    // Set initial state based on scroll position on mount
    if (window.scrollY > 80) {
      setShowTopStrip(false);
    } else {
      setShowTopStrip(true);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLiveCategories(Array.isArray(categories) ? categories : []);
  }, [categories]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API;
    const userId = process.env.NEXT_PUBLIC_USER_ID;
    if (!baseUrl || !userId) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const loadLiveCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/public/categories/${userId}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) return;
        const payload = await res.json();
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        if (list.length === 0) return;
        const mapped = list.map((cat) => ({
          ...cat,
          name: cat.category_name || cat.name || 'Unknown',
          slug: cat.slug || cat.category_slug || String(cat.category_name || cat.name || '').toLowerCase().replace(/\s+/g, '-'),
          image: (cat.image_path || cat.image_url || cat.image || '/no-image.svg').toString().trim(),
        }));
        const mappedAllowed = mapped.filter((cat) =>
          allowedHeaderCategories.has(normalizeCategory(cat?.name))
        );
        if (mappedAllowed.length >= 4) {
          setLiveCategories(mapped);
        }
      } catch {
        // Keep SSR/fallback categories if live refresh fails
      } finally {
        clearTimeout(timeout);
      }
    };

    loadLiveCategories();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const normalizeCategory = (name = '') =>
    String(name).toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();

  const allowedHeaderCategories = new Set([
    'apple collection',
    'iphone',
    'andriod',
    'android',
    'mobile phone',
    'tablets',
    'tablet',
    'macbook',
    'ipad',
    'earbuds',
    'audio products',
    'power bank',
    'smart watch',
    'adapters',
    'accessories',
    'used phone',
  ]);

  const defaultCategories = [
    { name: "Apple Collection", slug: "apple-collection" },
    { name: "Andriod", slug: "andriod" },
    { name: "Macbook", slug: "macbook" },
    { name: "iPad", slug: "ipad" },
    { name: "Earbuds", slug: "earbuds" },
    { name: "Power Bank", slug: "power-bank" },
    { name: "Smart Watch", slug: "smart-watch" },
    { name: "Adapters", slug: "adapters" },
    { name: "Accessories", slug: "accessories" },
    { name: "Used Phone", slug: "used-phone" },
    { name: "Offer", slug: "special-offers", isOffer: true },
  ];

  const filteredHeaderCategories = (Array.isArray(liveCategories) ? liveCategories : []).filter((cat) =>
    allowedHeaderCategories.has(normalizeCategory(cat?.name))
  );

  const baseCategories = filteredHeaderCategories.length >= 4 ? filteredHeaderCategories : defaultCategories;
  
  // Force show "Used Phone" if not already present in the list
  const displayCategories = baseCategories.some(cat => normalizeCategory(cat?.name) === 'used phone')
    ? baseCategories
    : [...baseCategories, { name: "Used Phone", slug: "used-phone" }];

  const categoryIconMap = {
    'apple collection': '/svg/apple logo.svg',
    'iphone': '/svg/apple logo.svg',
    'andriod': '/svg/android.svg',
    'android': '/svg/android.svg',
    'macbook': '/svg/laptop.svg',
    'ipad': '/svg/mobile.svg',
    'tab': '/svg/mobile.svg',
    'tablet': '/svg/mobile.svg',
    'earbuds': '/svg/earbuds.svg',
    'earbud': '/svg/earbuds.svg',
    'power bank': '/svg/power bank.svg',
    'smart watch': '/svg/watch.svg',
    'charger combo': '/svg/cable.svg',
    'adapters': '/svg/cable.svg',
    'used phone': '/svg/used phone.svg',
    'adapter': '/svg/cable.svg',
    'cable': '/svg/cable.svg',
    'cover': '/svg/mobile.svg',
    'screen protector': '/svg/mobile.svg',
    'camera lens': '/svg/mobile.svg',
    'speakers': '/svg/earbuds.svg',
    'speaker': '/svg/earbuds.svg',
    'accessories': '/svg/mobile.svg',
  };

  const getCategoryIcon = (name) => {
    const normalized = normalizeCategory(name);
    const singular = normalized.endsWith('s') ? normalized.slice(0, -1) : normalized;
    const iconSrc = categoryIconMap[normalized] || categoryIconMap[singular];
    if (!iconSrc) return null;
    return (
      <Image
        src={iconSrc}
        alt={`${name || 'Category'} icon`}
        width={22}
        height={22}
        className="w-[22px] h-[22px] object-contain shrink-0 opacity-80 [filter:invert(57%)_sepia(8%)_saturate(548%)_hue-rotate(350deg)_brightness(91%)_contrast(86%)]"
        unoptimized
      />
    );
  };

  const handleUserClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      openAuthModal('login');
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const toggleMobileCategory = (catId) => {
    setExpandedMobileCategory(prev => prev === catId ? null : catId);
  };

  const [hoverCategoryIndex, setHoverCategoryIndex] = useState(null);
  const [allMenuCategory, setAllMenuCategory] = useState(null);
  const allMenuTimeoutRef = useRef(null);

  const openMegaMenu = (idx) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverCategoryIndex(idx);
  };

  const scheduleCloseMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverCategoryIndex(null);
    }, 800);
  };

  const openAllMenu = (cat) => {
    if (allMenuTimeoutRef.current) {
      clearTimeout(allMenuTimeoutRef.current);
      allMenuTimeoutRef.current = null;
    }
    setAllMenuCategory(cat);
  };

  const scheduleCloseAllMenu = () => {
    if (allMenuTimeoutRef.current) clearTimeout(allMenuTimeoutRef.current);
    allMenuTimeoutRef.current = setTimeout(() => {
      setAllMenuCategory(null);
    }, 180);
  };

  // ── Search Logic ──
  const runSearch = async (q) => {
    if (!q) {
      setSearchResults([]);
      setSearchCategories([]);
      setSearchError('');
      return;
    }

    setIsSearchOpen(true);
    setIsSearching(true);
    setSearchError('');

    try {
      const res = await searchProducts(q);
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      const mapped = items.map(mapApiProductToCard).filter(Boolean);

      setSearchResults(mapped);
      const cats = Array.from(new Set(mapped.map((m) => m.categoryName))).sort();
      setSearchCategories(cats);
      setActiveSearchCategory('all');
    } catch {
      setSearchError('Something went wrong. Please try again.');
      setSearchResults([]);
      setSearchCategories([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    runSearch(q);
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { 
      setSearchResults([]); 
      setSearchCategories([]); 
      setSearchError(''); 
      return; 
    }
    const timeout = setTimeout(() => runSearch(q), 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (!showDesktopProductFeed || !feedHasMore) return;

    const root = feedScrollRef.current;
    if (!root) return;

    const tryLoadMore = () => {
      if (isFeedLoading || isFeedLoadingMore) return;
      const { scrollTop, scrollHeight, clientHeight } = root;
      if (scrollHeight - scrollTop - clientHeight <= 64) {
        loadMoreFeed(SEARCH_FEED_COLS * SEARCH_FEED_SCROLL_ROWS);
      }
    };

    const onScroll = () => tryLoadMore();

    root.addEventListener('scroll', onScroll, { passive: true });

    const sentinel = feedSentinelRef.current;
    let observer;
    if (sentinel) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) tryLoadMore();
        },
        { root, rootMargin: '48px', threshold: 0 }
      );
      observer.observe(sentinel);
    }

    const raf = requestAnimationFrame(() => {
      if (root.scrollHeight <= root.clientHeight + 8) tryLoadMore();
    });

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, [showDesktopProductFeed, feedHasMore, isFeedLoading, isFeedLoadingMore, loadMoreFeed, feedProducts.length]);

  const closeSearchModal = () => setIsSearchOpen(false);

  const filteredSearchResults = useMemo(() => {
    if (activeSearchCategory === 'all') return searchResults;
    return searchResults.filter((p) => p.categoryName === activeSearchCategory);
  }, [searchResults, activeSearchCategory]);

  return (
    <>
      <header className="w-full sticky top-0 z-50 flex flex-col font-[family-name:var(--font-outfit)]" style={{ background: '#FFFFFF' }}>

        {/* ── ALERTS / MINI TOP BAR ── */}
        <div
          className={`hidden md:grid transition-[grid-template-rows,opacity,border-color] duration-300 ease-out ${
            showTopStrip ? 'grid-rows-[1fr] opacity-100 border-b' : 'grid-rows-[0fr] opacity-0 border-b-0 pointer-events-none'
          }`} style={{ background: '#F3F4F6', borderColor: '#E8EAED' }}
        >
          <div className="overflow-hidden">
          <div className="max-w-[1248px] mx-auto px-0 h-10 flex items-center justify-between text-[12px] font-[family-name:var(--font-outfit)]" style={{ color: '#6B7280' }}>
            <a href="tel:09611901399" className="font-bold transition-colors flex items-center gap-1.5 text-[14px] outline-none" style={{ color: '#111827' }}>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#6B7280' }}>Hotline 24/7</span>
              09611-901399
            </a>
            <div className="flex items-center gap-6 uppercase tracking-[0.03em] text-[11px] font-bold">
              <Link href="/blogs" className="transition-colors" style={{ color: '#6B7280' }}>
                BLOG
              </Link>
              <Link href="/track-order" className="transition-colors" style={{ color: '#6B7280' }}>
                ORDER TRACKING
              </Link>
              <Link href="/contact" className="transition-colors" style={{ color: '#6B7280' }}>
                CONTACT
              </Link>
              <Link href="/emi-policy" className="transition-colors" style={{ color: '#6B7280' }}>
                EMI POLICY
              </Link>
            </div>
          </div>
          </div>
        </div>

        {/* MAIN TOP BAR */}
        <div style={{ background: '#151517', borderBottom: '1px solid #2D2E33' }}>
          <div className="py-0 h-[80px] max-w-[1248px] mx-auto px-0 flex items-center justify-between gap-0.5 md:gap-4 font-[family-name:var(--font-outfit)]">

            {/* Logo */}
            <div className="flex items-center flex-shrink-0 order-1 md:order-none min-w-[66px] md:min-w-[90px] overflow-visible ml-4 md:ml-8">
              <Link href="/" aria-label="Applex Home" className="relative z-50 transition-transform duration-300 flex items-center overflow-visible">
                <Image
                  src="/Applex Logo.png"
                  alt="Applex Logo"
                  width={320}
                  height={110}
                  className="h-9 md:h-11 w-auto max-w-none object-contain brightness-0 invert"
                  unoptimized
                  priority
                />
              </Link>
            </div>

            {/* Main Search Bar (Middle on Mobile) */}
            <div ref={searchContainerRef} className="flex-1 max-w-3xl relative order-2 md:order-none ml-1 md:ml-6">
              <form onSubmit={handleSearchSubmit} className="flex relative w-full h-10 md:h-[44px] rounded-full items-center overflow-hidden px-3 md:px-4 gap-1.5 md:gap-2" style={{ background: '#FFFFFF', border: 'none' }}>
                <FiSearch className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-900 opacity-30 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search anything.."
                  className="w-full h-full py-0 text-[12px] md:text-[14px] font-medium text-gray-900 outline-none border-none bg-transparent placeholder-gray-400 placeholder-opacity-30"
                />

                {searchQuery && (
                  <button type="button" onClick={() => { setSearchQuery(''); closeSearchModal(); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <FiX className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                )}

                <button type="button" className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-1">
                  <FiMic className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </button>
              </form>

              {/* Desktop Search Dropdown */}
              {isSearchOpen && (
                <div
                  className={`fixed md:absolute top-[80px] md:top-[calc(100%+12px)] z-50 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl shadow-2xl ${
                    searchQuery.trim()
                      ? 'left-1/2 -translate-x-1/2 w-[calc(100vw-10px)] md:w-[1200px] max-w-[calc(100vw-10px)] max-h-[75vh]'
                      : 'left-1/2 -translate-x-1/2 w-[calc(100vw-10px)] max-w-[calc(100vw-10px)] md:left-0 md:translate-x-0 md:w-full md:max-w-none'
                  }`}
                >
                  {isSearching ? (
                    <div className="p-12 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
                  ) : searchError ? (
                    <div className="p-6 text-center text-red-500">{searchError}</div>
                  ) : (
                    /* Empty search: product feed | Typed search: results */
                    <>
                      {searchQuery.trim() ? (
                        /* Results View when typing */
                        searchResults.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">No results found for &quot;{searchQuery}&quot;</div>
                        ) : (
                          <div className="flex flex-col md:flex-row h-full max-h-[75vh]">
                            <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-4 md:p-6 overflow-x-auto md:overflow-y-auto no-scrollbar">
                              <div className="flex md:flex-col gap-1.5 md:space-y-1.5 min-w-max md:min-w-0">
                                <button onClick={() => setActiveSearchCategory('all')} className={`whitespace-nowrap px-4 py-2 md:py-2.5 rounded-full md:rounded-md text-[13px] md:text-sm transition-all ${activeSearchCategory === 'all' ? 'bg-white shadow-md text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>All ({searchResults.length})</button>
                                {searchCategories.map(cat => (
                                  <button key={cat} onClick={() => setActiveSearchCategory(cat)} className={`whitespace-nowrap px-4 py-2 md:py-2.5 rounded-full md:rounded-md text-[13px] md:text-sm transition-all ${activeSearchCategory === cat ? 'bg-white shadow-md text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>{cat}</button>
                                ))}
                              </div>
                            </div>
                            <div className="flex-1 p-3 md:p-6 overflow-y-auto content-start">
                              <div className="hidden md:grid grid-cols-4 gap-1.5">
                                {filteredSearchResults.map(product => (
                                    <div key={product.id} onClick={closeSearchModal}>
                                    <ProductCard product={product} variant="compact" />
                                  </div>
                                ))}
                              </div>

                              <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-2">
                                {filteredSearchResults.map(product => (
                                  <Link
                                    key={product.id}
                                    href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                    onClick={closeSearchModal}
                                    className="group flex flex-row items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
                                  >
                                    <div className="w-16 h-16 relative bg-white border border-gray-100 rounded-lg shrink-0 overflow-hidden">
                                      <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2 hover:scale-110 transition-transform duration-300" unoptimized />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                      </h4>
                                      <p className="text-base font-extrabold text-gray-900">{product.price}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        <>
                          <div className="md:hidden p-8 text-center text-sm text-gray-500">
                            Type to search products
                          </div>

                          <div
                            ref={feedScrollRef}
                            className="hidden md:block max-h-[calc(3*176px+2*0.375rem+0.5rem)] overflow-y-auto p-2"
                          >
                            {isFeedLoading && feedProducts.length === 0 ? (
                              <div className="flex justify-center items-center py-16">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                              </div>
                            ) : feedProducts.length === 0 ? (
                              <div className="py-16 text-center text-sm text-gray-400">No products to show</div>
                            ) : (
                              <div className="grid grid-cols-4 gap-1.5">
                                {feedProducts.map((product) => (
                                    <div key={product.id} onClick={closeSearchModal}>
                                    <ProductCard product={product} variant="compact" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {isFeedLoadingMore && (
                              <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                              </div>
                            )}

                            {feedHasMore && (
                              <div ref={feedSentinelRef} className="h-8 shrink-0" aria-hidden />
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Actions & Menu (Right on Mobile) */}
            <div className="flex items-center justify-end md:w-auto gap-4 md:gap-6 flex-shrink-0 text-white order-3 md:order-none ml-4 md:ml-8">
              <Link href="/compare" className="hidden md:flex items-center gap-2.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#23242A', color: '#FFFFFF' }}>
                  <FiShuffle className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wide transition-colors" style={{ color: '#FFFFFF' }}>COMPARE</span>
              </Link>

              <button type="button" onClick={handleUserClick} className="hidden md:flex items-center gap-2.5 cursor-pointer group" aria-label="Account">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#23242A', color: '#FFFFFF' }}>
                  <FiUser className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[9px] leading-tight uppercase font-medium" style={{ color: '#6B7280' }}>WELCOME</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide transition-colors leading-tight" style={{ color: '#FFFFFF' }}>
                    LOGIN/REGISTER
                  </span>
                </div>
              </button>

              <button type="button" onClick={openCart} className="hidden md:flex items-center gap-2.5 cursor-pointer group" aria-label="Cart">
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: '#23242A', color: '#FFFFFF' }}>
                  <FiShoppingCart className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[9px] leading-tight uppercase font-medium" style={{ color: '#6B7280' }}>CART</span>
                  <span className="text-[12px] font-bold tracking-wide transition-colors leading-tight" style={{ color: '#FFFFFF' }}>
                    {cartTotal > 0 ? `${cartTotal.toLocaleString('en-IN')}` : '0.00'}
                  </span>
                </div>
              </button>

              {/* Mobile Menu Button (Custom icon at far right) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden h-9 w-9 rounded-md border border-white/25 text-white flex items-center justify-center flex-shrink-0 mr-2"
                aria-label="Menu"
              >
                {/* Use a grid-style icon instead of traditional hamburger */}
                <FiGrid className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="hidden md:block relative z-40 overflow-visible md:rounded-b-lg" style={{ background: 'rgba(255,255,255,0.85)', borderTop: '1px solid #E8EAED', backdropFilter: 'blur(10px)' }}>
          <div className="max-w-[1248px] mx-auto px-2 md:px-4 h-14 flex items-center justify-between gap-6 font-[family-name:var(--font-outfit)]">

            <div className="flex-shrink-0 flex items-center">

              {/* All Categories Dropdown Trigger */}
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-all group relative" style={{ color: '#111827' }}
                onMouseEnter={() => openAllMenu(displayCategories?.[0] ?? null)}
                onMouseLeave={scheduleCloseAllMenu}
              >
                <FiGrid size={22} className="group-hover:text-[#000000]" />

                <div
                  className={`absolute top-full left-0 mt-2 w-[min(520px,calc(100vw-32px))] bg-white border border-gray-200 shadow-[0_24px_60px_rgba(2,6,23,0.18)] rounded-md z-50 transition-all duration-500 ease-in-out ${
                    allMenuCategory ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-5 pointer-events-none'
                  }`}
                  onMouseEnter={() => {
                    if (allMenuTimeoutRef.current) {
                      clearTimeout(allMenuTimeoutRef.current);
                      allMenuTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={scheduleCloseAllMenu}
                >
                  <div className="flex gap-0">
                    {/* Left: categories */}
                    <div className="w-[200px] shrink-0 border-r border-gray-100 py-1">
                      {displayCategories.map((cat, idx) => {
                        const isActive = (allMenuCategory?.id || allMenuCategory?.category_id || allMenuCategory?.name) === (cat.id || cat.category_id || cat.name);
                        const hasSubs = Array.isArray(cat?.sub_category) && cat.sub_category.length > 0;
                        return (
                          <button
                            key={cat.id || idx}
                            type="button"
                            onMouseEnter={() => openAllMenu(cat)}
                            className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors flex items-center justify-between gap-2 ${
                              isActive
                                ? 'bg-[#000000] text-white'
                                : 'text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {hasSubs && (
                              <FiChevronRight size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: subcategories */}
                    <div className="flex-1 min-w-0 py-1">
                      {(() => {
                        const catSlug = allMenuCategory?.slug || allMenuCategory?.name?.toLowerCase().replace(/\s+/g, '-');
                        const subcategories = Array.isArray(allMenuCategory?.sub_category) ? allMenuCategory.sub_category : [];

                        if (!allMenuCategory) return null;

                        if (subcategories.length === 0) {
                          return (
                            <div className="px-4 py-8 text-center">
                              <p className="text-[13px] font-semibold text-gray-500">No subcategory available</p>
                              <Link
                                href={`/category/${catSlug}`}
                                className="mt-3 inline-block text-[12px] font-bold text-[#000000] underline underline-offset-2"
                              >
                                View category
                              </Link>
                            </div>
                          );
                        }

                        return (
                          <>
                            {subcategories.map((subcat) => (
                              <Link
                                key={subcat.id || subcat.name}
                                href={`/category/${catSlug}?subcategory_id=${subcat.id}`}
                                className="block px-4 py-2.5 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#000000] hover:text-white"
                              >
                                {subcat.name}
                              </Link>
                            ))}
                            <div className="border-t border-gray-100 px-4 py-2 mt-1">
                              <Link
                                href={`/category/${catSlug}`}
                                className="text-[11px] font-bold uppercase tracking-wide text-[#000000] hover:underline"
                              >
                                View all products
                              </Link>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Links */}
            <nav className="flex-1 flex items-center justify-evenly overflow-x-auto lg:overflow-x-visible lg:overflow-y-visible no-scrollbar scroll-smooth px-0.5">
              <div className="flex items-center justify-evenly gap-5 w-full">
                {displayCategories.map((cat, idx) => {
                  const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
                  const subcategories = Array.isArray(cat?.sub_category) ? cat.sub_category : [];
                  const hasSubcategories = subcategories.length > 0;
                  const isMenuOpen = hoverCategoryIndex === idx;

                  return (
                  <div
                    key={cat.id || idx}
                    className="relative py-1 h-full hidden lg:block overflow-visible"
                    onMouseEnter={() => openMegaMenu(idx)}
                    onMouseLeave={scheduleCloseMegaMenu}
                  >
                    <Link
                      href={`/category/${catSlug}`}
                      className={`text-[13px] xl:text-[14px] leading-none whitespace-nowrap transition-colors flex items-center gap-1.5 font-normal ${
                        isMenuOpen ? 'text-[#000000]' : 'hover:text-[#000000]'
                      }`}
                      style={{ color: isMenuOpen ? '#000000' : '#111827', fontFamily: 'var(--font-outfit)' }}
                    >
                      <span>{cat.name || cat.category_name}</span>
                      {hasSubcategories && (
                        isMenuOpen
                          ? <FiChevronUp size={16} className="shrink-0" strokeWidth={2.5} />
                          : <FiChevronDown size={16} className="shrink-0" strokeWidth={2.5} />
                      )}
                    </Link>
                    
                      <div
                        className={`absolute top-full left-1/2 z-50 -translate-x-1/2 pt-1 w-[220px] overflow-visible transition-all duration-500 ease-in-out ${
                          isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-5 pointer-events-none'
                        }`}
                        onMouseEnter={() => openMegaMenu(idx)}
                        onMouseLeave={scheduleCloseMegaMenu}
                      >
                        <div className="w-full overflow-visible rounded-md border border-gray-200 bg-white shadow-lg">
                            {!hasSubcategories ? (
                              <div className="px-4 py-6 text-center">
                                <p className="text-[13px] font-semibold text-gray-500">No subcategory available</p>
                                <Link
                                  href={`/category/${catSlug}`}
                                  className="mt-3 inline-block text-[12px] font-bold text-[#000000] underline underline-offset-2"
                                >
                                  View category
                                </Link>
                              </div>
                            ) : (
                              <div className="py-1">
                                {subcategories.map((subcat) => (
                                  <Link
                                    key={subcat.id || subcat.name}
                                    href={`/category/${catSlug}?subcategory_id=${subcat.id}`}
                                    className="block px-4 py-2.5 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#000000] hover:text-white"
                                  >
                                    {subcat.name}
                                  </Link>
                                ))}
                                <div className="border-t border-gray-100 px-4 py-2">
                                  <Link
                                    href={`/category/${catSlug}`}
                                    className="text-[11px] font-bold uppercase tracking-wide text-[#000000] hover:underline"
                                  >
                                    View all products
                                  </Link>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                  </div>
                  );
                })}
              </div>
            </nav>

            {/* Right CTA */}
            <div className="flex-shrink-0 flex items-center justify-end relative min-w-[120px]">
              <Link
                href="/special-offers"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '110px',
                  height: '38px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  zIndex: 1,
                  borderRadius: '8px',
                  background: 'linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000)',
                  backgroundSize: '400%',
                  animation: 'move_142 20s linear infinite',
                  boxShadow: '0 0 15px rgba(255,100,100,0.4)',
                }}
              >
                <span style={{
                  position: 'relative',
                  zIndex: 11,
                  background: '#000000',
                  width: 'calc(100% - 4px)',
                  height: 'calc(100% - 4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  color: '#ffffff',
                }}>Offer</span>
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════════════════ */}
      {/* MOBILE SIDEBAR */}
      {/* ═══════════════════════════════════════════════════ */}

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity" onClick={closeSidebar} />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[300px] max-w-[86vw] bg-white z-[70] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="py-0 px-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between min-h-[68px]">
          <Image
            src="/Applex Logo.png"
            alt="Applex Logo"
            width={240}
            height={80}
            className="h-16 w-auto object-contain brightness-0 invert"
            unoptimized
          />
          <button onClick={closeSidebar} className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Close menu">
            <FiX size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2.5 py-4 space-y-6">
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-2 px-1">Categories</h4>
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                {displayCategories.map((cat, idx) => (
                  <div key={cat.id || idx} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-center px-2 py-2.5 text-[13px] text-gray-700 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <Link
                        href={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={closeSidebar}
                        className="flex-1 min-w-0 flex items-center gap-2.5"
                      >
                        <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                          <Image
                            src={(cat.image || cat.image_path || cat.image_url || "/no-image.svg").toString().trim()}
                            alt={cat.name || cat.category_name || 'Category'}
                            width={18}
                            height={18}
                            className="w-[18px] h-[18px] object-contain"
                            unoptimized
                          />
                        </div>
                        <span className="flex-1 truncate">{cat.name || cat.category_name}</span>
                      </Link>
                      <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleMobileCategory(cat.id || idx);
                          }}
                          className="ml-2 w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
                          aria-label={`Toggle ${cat.name || cat.category_name}`}
                        >
                          <FiChevronRight
                            size={14}
                            className={`transform transition-transform ${expandedMobileCategory === (cat.id || idx) ? "rotate-90" : ""
                              }`}
                          />
                        </button>
                    </div>

                    {expandedMobileCategory === (cat.id || idx) && (
                        <div className="bg-gray-50/50 px-2 py-2 border-t border-gray-100/50 flex flex-col gap-1">
                          {(() => {
                            const catId = cat.category_id || cat.id;
                            const brands = getBrandsForCategory(catId);
                            const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
                            if (brands.length === 0) {
                              return (
                                isFetchingBrands ? (
                                  <div className="py-2 text-[12px] text-gray-400 italic pl-2.5">
                                    Loading brands...
                                  </div>
                                ) : (
                                  <div className="py-2 text-[12px] text-gray-400 pl-2.5">
                                    No brands found
                                  </div>
                                )
                              );
                            }
                            return brands.map((brand) => (
                              <Link
                                key={brand.name}
                                href={`/category/${catSlug}?brand=${encodeURIComponent(brand.name)}`}
                                onClick={closeSidebar}
                                className="py-2 text-[12px] text-gray-600 hover:text-blue-600 pl-2.5 border-l-2 border-gray-200 hover:border-blue-600 transition-colors flex items-center gap-2"
                              >
                                {brand.image ? (
                                  <Image src={brand.image} alt={brand.name} width={16} height={16} className="w-4 h-4 rounded-full object-contain bg-white" unoptimized />
                                ) : (
                                  <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 flex-shrink-0">{brand.name.charAt(0)}</span>
                                )}
                                {brand.name}
                              </Link>
                            ));
                          })()}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Other Links */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-2">Quick Links</h4>
              <div className="flex flex-col gap-1">
                <Link
                  href="/track-order"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiTruck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/compare"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiCopy className="w-3.5 h-3.5 text-blue-500" />
                  <span>Compare Phones</span>
                </Link>
                <Link
                  href="/special-offers"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiZap className="w-3.5 h-3.5 text-red-500" />
                  <span>Flash Deals & Offers</span>
                </Link>
                <Link
                  href="/blogs"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiFileText className="w-3.5 h-3.5 text-purple-500" />
                  <span>Blogs</span>
                </Link>
                <Link
                  href="/emi-policy"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiCreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>EMI Policy</span>
                </Link>
                <Link
                  href="/about"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiInfo className="w-3.5 h-3.5 text-gray-500" />
                  <span>About Us</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={closeSidebar}
                  className="px-3 py-2 rounded text-[12px] text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <FiHeadphones className="w-3.5 h-3.5 text-green-500" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2.5 bg-gradient-to-b from-gray-50 to-white">
          <button
            onClick={() => { closeSidebar(); handleUserClick(); }}
            className="flex justify-center items-center gap-1.5 py-2.5 bg-white border border-gray-200 rounded-lg font-semibold text-[13px] text-gray-700 hover:text-blue-600 hover:border-blue-200 transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <FiUser size={14} />
            </span>
            {user ? 'Profile' : 'Login'}
          </button>
          <button
            onClick={() => { closeSidebar(); openCart(); }}
            className="flex justify-center items-center gap-1.5 py-2.5 bg-blue-600 rounded-lg font-semibold text-[13px] text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/30"
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <FiShoppingCart size={14} />
            </span>
            Cart
          </button>
        </div>
      </div>
      <style jsx>{`
        .btn-142 {
          --BG_color: #000000;
          --color: #ffffff;
          width: 110px;
          height: 38px;
          border: none;
          color: var(--color);
          position: relative;
          font-weight: bold;
          font-size: 15px;
          transition-duration: .2s;
          background: none;
          font-family: Arial, Helvetica, sans-serif;
          cursor: pointer;
          text-decoration: none;
          user-select: none;
          padding: 0;
          z-index: 1;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        .btn-142 span {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 11;
          background: var(--BG_color);
          border-radius: 7px;
        }
        .btn-142:before,
        .btn-142:after {
          content: '';
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 10px;
          background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
          background-size: 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: -1;
          animation: move_142 20s linear infinite;
        }
        @keyframes move_142 {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
        .btn-142:after {
          filter: blur(50px);
        }
        .subcat-drop-in {
          animation: slideDown 0.3s ease-out;
          transform-origin: top center;
          will-change: transform, opacity;
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-8px) scaleY(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
      `}</style>
    </>
  );
}



