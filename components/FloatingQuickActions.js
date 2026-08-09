"use client";
import { useState, useEffect } from "react";

const WHATSAPP_URL = "https://wa.me/8801980803060";

const AGENT_IMAGES = ["/customer-service.png"];

export default function FloatingQuickActions() {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % AGENT_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-6 z-[55]"
    >
      <div className="relative w-14 h-14">
        {/* Agent image */}
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg relative ring-2 ring-white ring-offset-2 ring-offset-gray-100">
          {AGENT_IMAGES.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Support Agent"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${idx === currentImg ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        {/* Online dot only */}
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      </div>
    </a>
  );
}



