"use client";

import Image from "next/image";

export default function ServiceHighlightsStrip({ className = "" }) {
  const serviceHighlights = [
    { label: "36 Months EMI", icon: "/site-svg/emi%20applex%201.svg" },
    { label: "Fastest Home Delivery", icon: "/site-svg/Delivery-applex.svg" },
    { label: "Exchange Facility", icon: "/site-svg/exchange%20-%20applex%201.svg" },
    { label: "Best Price Deals", icon: "/site-svg/best-price_applex.svg" },
    { label: "After-Sales Service", icon: "/site-svg/help-call_applex.svg" },
  ];

  return (
    <div className={className}>
      <div className="rounded-xl border border-[#e9edf3] bg-transparent px-4 md:px-8 py-2 md:py-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 md:gap-x-7 gap-y-1 md:gap-y-3">
          {serviceHighlights.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-2 md:gap-3 min-h-[36px] md:min-h-[44px] ${
                idx === serviceHighlights.length - 1 && serviceHighlights.length % 2 === 1
                  ? "col-span-2 md:col-span-1"
                  : ""
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={22}
                height={22}
                className="h-[18px] w-[18px] md:h-[22px] md:w-[22px] object-contain shrink-0"
              />
              <span className="text-[13px] md:text-[14px] font-medium leading-tight text-[#4b5563] whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
