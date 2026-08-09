export default function SEOContent() {
  const cards = [
    {
      title: "Bangladesh's Largest Retail Gadget Shop – Applex",
      description: "Applex is one of Bangladesh's leading retail gadget shops, offering a wide selection of smartphones, laptops, tablets, smartwatches, audio devices, and premium accessories from top global brands. Explore the latest iPhone, Samsung Galaxy, Xiaomi, OnePlus, Google Pixel, MacBook, iPad, Apple Watch, AirPods, Dell, HP, Lenovo, ASUS, Acer, and more—all in one trusted destination. We are committed to providing authentic products, competitive prices, fast nationwide delivery, secure payment options, and reliable customer support, making Applex a trusted choice for technology lovers across Bangladesh.",
    },
    {
      title: "Best Place to Buy Used & Pre-Owned iPhones in Bangladesh",
      description: "Looking for a reliable place to buy used and pre-owned iPhones in Bangladesh? Applex offers a carefully selected collection of premium pre-owned iPhones that are professionally inspected, tested, and verified for quality and performance. Choose from popular models including iPhone 11, iPhone 12, iPhone 13, iPhone 14, iPhone 15, and newer generations at competitive prices. Every device is checked to ensure excellent condition, strong battery performance, and dependable functionality before reaching our customers. With trusted service, transparent pricing, fast nationwide delivery, and dedicated customer support, Applex makes it easy to own a premium iPhone without paying the price of a brand-new device.",
    },
    {
      title: "Premium Mobile Accessories Store in Bangladesh",
      description: "Complete your smartphone experience with high-quality mobile accessories from Applex. We offer an extensive collection of fast chargers, USB cables, MagSafe accessories, power banks, phone cases, screen protectors, adapters, wireless chargers, and other essential mobile accessories from trusted brands. Every product is selected for durability, performance, and compatibility, ensuring reliable everyday use. Whether you need protection for your device or accessories that enhance productivity, Applex provides premium quality products at competitive prices with fast nationwide delivery and dependable customer support.",
    },
    {
      title: "AirPods, Wireless Earbuds & Premium Audio Store",
      description: "Experience exceptional sound quality with the latest AirPods, wireless earbuds, Bluetooth headphones, speakers, and premium audio accessories at Applex. Our collection includes products from Apple, JBL, Anker, Soundcore, Xiaomi, Sony, and other leading brands, delivering immersive audio for music, gaming, work, and entertainment. Whether you're looking for crystal-clear calls, deep bass, or active noise cancellation, Applex offers authentic products, competitive pricing, fast delivery, and reliable after-sales support across Bangladesh.",
    },
    {
      title: "Trusted Mobile Phone Store in Bangladesh",
      description: "Applex is a trusted destination for purchasing authentic smartphones in Bangladesh. Browse the latest iPhone, Samsung Galaxy, Xiaomi, OnePlus, Google Pixel, Nothing Phone, Motorola, and other leading smartphone brands at competitive prices. Whether you're upgrading to a flagship device or searching for a budget-friendly smartphone, we offer genuine products, transparent pricing, secure payment options, fast nationwide delivery, and dedicated customer service to ensure a seamless shopping experience.",
    },
    {
      title: "Best Gadget Deals & Competitive Prices in Bangladesh",
      description: "Looking for the best prices on smartphones, laptops, Apple devices, gadgets, and accessories in Bangladesh? Applex offers competitive pricing without compromising on quality or authenticity. From flagship smartphones and MacBooks to smartwatches, tablets, audio devices, and premium accessories, we make technology more affordable for everyone. Enjoy exclusive offers, genuine products, nationwide delivery, secure payment methods, and trusted customer support, making Applex a preferred choice for smart technology shopping in Bangladesh.",
    },
  ];

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="max-w-[1248px] mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "24px",
                height: "500px",
                overflow: "hidden",
              }}
            >
              <h2 style={{ fontWeight: "bold", fontSize: "24px", color: "#0f172a", marginBottom: "10px", fontFamily: "var(--font-outfit)" }}>
                {card.title}
              </h2>
              <p style={{ fontSize: "20px", color: "#334155", lineHeight: "1.6", fontFamily: "var(--font-outfit)" }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}






