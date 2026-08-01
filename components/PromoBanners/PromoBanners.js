import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanners({ banners = [] }) {
    if (!banners || banners.length === 0) return null;

    const isSingle = banners.length === 1;

    return (
        <section className="w-full bg-transparent pb-6 md:pb-8 pt-2">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                <div className={`grid gap-4 md:gap-8 ${isSingle ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {banners.map((banner, idx) => {
                        const hasImage = banner.image && banner.image !== '/no-image.svg';
                        const fallbackStyle = banner.backgroundColor
                            ? { backgroundColor: banner.backgroundColor }
                            : undefined;

                        return (
                            <Link
                                key={banner.id || idx}
                                href={banner.link || '/'}
                                className={`relative overflow-hidden rounded-xl group shadow-2xl shadow-gray-200/50 border border-white transition-all duration-500 hover:shadow-blue-600/10 hover:-translate-y-1 ${
                                    isSingle ? 'aspect-[3/1] md:aspect-[9/2]' : 'aspect-[20/9] md:aspect-[5/3] lg:aspect-[3/1]'
                                }`}
                            >
                                {hasImage ? (
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Special Promotion'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        unoptimized
                                    />
                                ) : (
                                    <div
                                        className={`w-full h-full flex flex-col justify-center p-8 md:p-12 ${
                                            !fallbackStyle
                                                ? idx % 2 === 0
                                                    ? 'bg-gradient-to-br from-[#1d1d1f] to-[#434345]'
                                                    : 'bg-gradient-to-br from-blue-600 to-indigo-700'
                                                : ''
                                        }`}
                                        style={fallbackStyle}
                                    >
                                        <span className="text-white/60 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] mb-3">
                                            {banner.type || 'Limited Offer'}
                                        </span>
                                        <h3 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-md">
                                            {banner.title || 'Upgrade Your Digital Life'}
                                        </h3>
                                        {banner.description && (
                                            <p className="text-white/80 text-sm md:text-base mt-3 max-w-lg">
                                                {banner.description}
                                            </p>
                                        )}
                                        <div className="mt-6 md:mt-8">
                                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[12px] md:text-[14px] font-black rounded-full hover:bg-gray-100 transition-colors">
                                                {banner.buttonText || 'Learn More'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

