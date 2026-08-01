import { Inter, Outfit } from "next/font/google";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import MobileBottomNav from "../components/MobileBottomNav/MobileBottomNav";
import FloatingQuickActions from "../components/FloatingQuickActions";
import Providers from "../components/Providers";
import HomePopup from "../components/HomePopup";
import { getCategoriesFromServer } from "../lib/api";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Applex | Premium Smartphones & Devices",
  description: "Bangladesh's premier destination for authentic smartphones, tablets, and tech accessories. Shop iPhone, Samsung, OnePlus & more at Applex.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Applex | Premium Smartphones & Devices",
    description: "Bangladesh's premier destination for authentic smartphones, tablets, and tech accessories.",
    url: "https://applex.com.bd",
    siteName: "Applex",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: "Applex - Premium Smartphones & Devices",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Applex | Premium Smartphones & Devices",
    description: "Bangladesh's premier destination for authentic smartphones, tablets, and tech accessories.",
    images: ["/og.jpeg"],
  },
};

export default async function RootLayout({ children }) {
  let categories = [
    { id: 1, name: "iPhone", slug: "iphone" },
    { id: 2, name: "Samsung", slug: "samsung" },
    { id: 3, name: "OnePlus", slug: "oneplus" },
    { id: 4, name: "Xiaomi", slug: "xiaomi" },
    { id: 5, name: "Google Pixel", slug: "google-pixel" },
    { id: 6, name: "Tablets", slug: "tablets" },
    { id: 7, name: "Accessories", slug: "accessories" },
  ];

  try {
    const res = await getCategoriesFromServer();
    const data = res?.data || (Array.isArray(res) ? res : null);
    const catList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : null);
    if (catList && catList.length > 0) {
      categories = catList.map(cat => ({
        ...cat,
        name: cat.category_name || cat.name || "Unknown",
        image: (cat.image_path || cat.image_url || cat.image || "/no-image.svg").toString().trim()
      }));
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#FCFAFA] text-gray-900 pb-16 md:pb-0`}
      >
        <Providers categories={categories}>
          <HomePopup />
          <Header categories={categories} />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <FloatingQuickActions />
          <MobileBottomNav />
          <Footer categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
