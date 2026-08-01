import Image from "next/image";
import Link from "next/link";

export default function BrandsMarquee({ brands = [] }) {
  if (!Array.isArray(brands) || brands.length === 0) return null;

  // Duplicate list for seamless marquee loop.
  const marqueeItems = [...brands, ...brands];

  return (
    <section className="w-full py-4 md:py-6 bg-transparent border-y border-gray-100">
      <div className="max-w-[1248px] mx-auto px-4 md:px-0 mb-5 md:mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Brands
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Shop by your favorite brands
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1248px] mx-auto px-4 md:px-0 overflow-hidden relative group">
        <div 
            className="animate-marquee gap-4 md:gap-5 flex items-center"
            style={{ animationDuration: '60s' }}
        >
          {marqueeItems.map((brand, idx) => (
            <Link
              key={`${brand.id}-${idx}`}
              href={`/brand/${brand.id}`}
              className="group h-[92px] md:h-[106px] min-w-[180px] md:min-w-[220px] rounded-2xl bg-white border border-gray-200 hover:border-[#ff8a1f]/50 hover:shadow-md transition-all flex items-center justify-center px-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 md:w-12 md:h-12 shrink-0">
                  <Image
                    src={brand.image || "/no-image.svg"}
                    alt={brand.name || "Brand"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-[#ff8a1f] whitespace-nowrap transition-colors">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


