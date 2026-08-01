"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiMessageCircle, FiShuffle, FiX } from "react-icons/fi";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

const WHATSAPP_URL = "https://wa.me/8801980803060";
const MESSENGER_URL = "https://www.facebook.com/Applex.bd";

export default function FloatingQuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed right-2 top-[72%] -translate-y-1/2 z-[55] flex flex-col items-end gap-2 md:right-3 md:top-[70%]"
    >
      <Link
        href="/compare"
        aria-label="Compare Products"
        className="h-[112px] w-10 rounded-full bg-[#ff8a00] text-white shadow-lg shadow-[#ff8a00]/30 border border-[#ffb347] hover:bg-[#ea7f00] transition-colors flex flex-col items-center justify-center"
      >
        <FiShuffle className="w-4 h-4 mb-1" />
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-semibold tracking-[0.08em] uppercase leading-none">
          Compare
        </span>
      </Link>

      <div className="relative">
        {isOpen && (
          <div className="absolute right-12 bottom-0 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 flex flex-col gap-1 min-w-[150px]">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4 text-green-600" />
              WhatsApp
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <FaFacebookMessenger className="w-4 h-4 text-blue-600" />
              Messenger
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close messaging options" : "Open messaging options"}
          className="h-11 w-11 rounded-full bg-[#ff8a00] text-white shadow-lg shadow-[#ff8a00]/30 border border-[#ffb347] hover:bg-[#ea7f00] transition-colors flex items-center justify-center"
        >
          {isOpen ? <FiX className="w-5 h-5" /> : <FiMessageCircle className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
