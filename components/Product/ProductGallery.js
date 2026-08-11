"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], showUsedTag = false }) {
    const imageArray = images && images.length > 0 
        ? images.map(img => typeof img === 'string' ? img.trim() : img) 
        : ['/no-image.svg'];
    const [mainImage, setMainImage] = useState(imageArray[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

    // When images prop changes (e.g., variant color selected), reset to first image
    useEffect(() => {
        if (images && images.length > 0) {
            setMainImage(images[0]);
            setCurrentIndex(0);
        }
    }, [images?.join(',')]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Container */}
            <div
                className={`flex-1 aspect-square relative bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center p-4 ${isZooming ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => {
                    setIsZooming(false);
                    setZoomOrigin({ x: 50, y: 50 });
                }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoomOrigin({
                        x: Math.max(0, Math.min(100, x)),
                        y: Math.max(0, Math.min(100, y)),
                    });
                }}
            >
                <Image
                    src={mainImage}
                    alt="Product Image"
                    fill
                    unoptimized
                    className="object-contain select-none pointer-events-none transition-transform duration-150 ease-out"
                    style={{
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transform: isZooming ? 'scale(2)' : 'scale(1)',
                    }}
                />
                {showUsedTag && (
                    <Image
                        src="/used_tag.png"
                        alt="Used product"
                        width={118}
                        height={36}
                        className="absolute left-8 bottom-18 z-20 h-auto w-[90px] md:w-[118px]"
                    />
                )}
            </div>

            {/* Thumbnail Strip (Always Bottom) */}
            <div className="relative">
                {imageArray.length > 5 && currentIndex > 0 && (
                    <button
                        onClick={() => {
                            const newIndex = currentIndex - 1;
                            setCurrentIndex(newIndex);
                            setMainImage(imageArray[newIndex]);
                            document.getElementById('thumb-strip').scrollBy({ left: -200, behavior: 'smooth' });
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-black hover:text-gray-600 transition-colors"
                        style={{ fontSize: '28px', fontWeight: '900', lineHeight: 1 }}
                    >
                        ‹
                    </button>
                )}
                <div id="thumb-strip" className="flex flex-row gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth shrink-0">
                    {imageArray.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setMainImage(img); setCurrentIndex(idx); }}
                            className={`relative w-[72px] h-[72px] md:w-[80px] md:h-[80px] aspect-square shrink-0 rounded-md border-2 overflow-hidden bg-white transition-all snap-start ${
                                mainImage === img ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                unoptimized
                                className="object-contain p-1.5"
                            />
                        </button>
                    ))}
                </div>
                {imageArray.length > 5 && currentIndex < imageArray.length - 1 && (
                    <button
                        onClick={() => {
                            const newIndex = currentIndex + 1;
                            setCurrentIndex(newIndex);
                            setMainImage(imageArray[newIndex]);
                            document.getElementById('thumb-strip').scrollBy({ left: 200, behavior: 'smooth' });
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-black hover:text-gray-600 transition-colors"
                        style={{ fontSize: '28px', fontWeight: '900', lineHeight: 1 }}
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    );
}
