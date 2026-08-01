"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ServiceHighlightsStrip from '../ServiceHighlights/ServiceHighlightsStrip';

function SideBannerTile({ banner, className = '', compact = false }) {
    const hasImage = banner.image && banner.image !== '/no-image.svg';
    const fallbackStyle = banner.backgroundColor ? { backgroundColor: banner.backgroundColor } : undefined;

    return (
        <Link
            href={banner.link || '/'}
            className={`relative overflow-hidden group bg-white border border-gray-200 block ${className}`}
        >
            {hasImage ? (
                <Image
                    src={banner.image}
                    alt={banner.title || 'Promotion'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                />
            ) : (
                <div
                    className={`w-full h-full flex flex-col justify-center ${compact ? 'p-2' : 'p-4 md:p-6'} ${!fallbackStyle ? 'bg-gray-100' : ''}`}
                    style={fallbackStyle}
                >
                    <h3 className={`font-black leading-tight ${compact ? 'text-[10px] text-gray-800' : 'text-sm md:text-xl text-gray-900'}`}>
                        {banner.title || 'Promotion'}
                    </h3>
                </div>
            )}
        </Link>
    );
}

export default function Hero({ slides = [], banners = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const activeSlides = Array.isArray(slides) ? slides : [];
    const sideBanners = (Array.isArray(banners) ? banners : []).slice(0, 2);

    useEffect(() => {
        if (activeSlides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlides.length]);

    const prevSlide = () => activeSlides.length && setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    const nextSlide = () => activeSlides.length && setCurrentSlide((prev) => (prev + 1) % activeSlides.length);

    return (
        <div className="w-full bg-transparent pt-1 pb-4 md:pt-1.5 md:pb-6">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0 space-y-4 md:space-y-6">
                <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:items-stretch gap-1 lg:gap-2">

                    {/* LEFT: MAIN SLIDER */}
                    <div className="w-full min-w-0 relative aspect-[16/7.5] md:aspect-[24/10] rounded-md md:rounded-lg overflow-hidden group bg-white border border-gray-200">
                        {/* No slides from API */}
                        {activeSlides.length === 0 && (
                            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
                                <span>Hero slides will appear here</span>
                            </div>
                        )}
                        {/* Slides */}
                        {activeSlides.map((slide, idx) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out h-full w-full ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    } ${slide.bgColor || 'bg-white'}`}
                            >
                                {/* Full Background Image & Clickable Link */}
                                {slide.image && slide.image !== "/no-image.svg" && (
                                    <Link href={slide.link || "/"} className="absolute inset-0 z-0">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title || "Hero Slide"}
                                            fill
                                            className="object-cover object-center"
                                            unoptimized
                                            priority={idx === 0}
                                        />
                                    </Link>
                                )}

                                {/* Fallback Background */}
                                {(!slide.image || slide.image === "/no-image.svg") && (
                                    <div className="absolute inset-0 bg-gray-200 z-0 flex flex-col items-center justify-center text-gray-400 text-xs text-center border-2 border-dashed border-gray-300">
                                        <span className="bg-white px-2 py-1 rounded">No Image provided</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Carousel Dots - only when we have slides */}
                        {activeSlides.length > 0 && (
                            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                                {activeSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className="group py-2 px-1"
                                        aria-label={`Go to slide ${idx + 1}`}
                                    >
                                        <div className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                            }`} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Left/Right Arrows */}
                        {activeSlides.length > 0 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                                >
                                    <FiChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* RIGHT: SIDE PROMO BANNERS */}
                    <div className="w-full min-w-0 flex flex-col gap-1 md:gap-1.5 lg:h-full lg:min-h-0">
                        {sideBanners.length > 0 ? (
                            <>
                                <div className={`grid gap-1 lg:hidden ${sideBanners.length === 1 ? 'grid-cols-1' : sideBanners.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                    {sideBanners.map((banner, idx) => (
                                        <SideBannerTile
                                            key={banner.id || idx}
                                            banner={banner}
                                            compact
                                            className="aspect-[4/3] rounded-md"
                                        />
                                    ))}
                                </div>

                                <div className="hidden lg:flex lg:flex-col lg:gap-1.5 lg:h-full lg:min-h-0">
                                    {sideBanners.map((banner, idx) => (
                                        <SideBannerTile
                                            key={banner.id || idx}
                                            banner={banner}
                                            className="flex-1 min-h-0 rounded-md md:rounded-lg"
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="hidden lg:flex w-full h-full bg-gray-100 rounded-md flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 min-h-[200px]">
                                <span>Promo Banners</span>
                            </div>
                        )}
                    </div>

                </div>

                <ServiceHighlightsStrip className="hidden md:block" />
            </div>
        </div>
    );
}

