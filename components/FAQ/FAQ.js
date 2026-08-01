"use client";

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ_ITEMS = [
    {
        q: "Are all phones sold by Applex 100% authentic?",
        a: "Yes, absolutely. We source all our devices directly from official distributors and authorized channels. Every phone comes with a valid IMEI number and official warranty card. We never sell refurbished or replica devices.",
    },
    {
        q: "What warranty do you offer?",
        a: "All phones come with the official manufacturer warranty (typically 1 year). Additionally, we provide our own Applex care guarantee for hassle-free claim processing throughout Bangladesh.",
    },
    {
        q: "Do you offer free delivery?",
        a: "Yes! We offer free delivery across Bangladesh for all orders. Dhaka city orders are typically delivered within 24 hours. Outside Dhaka, delivery takes 2-3 business days via trusted courier services.",
    },
    {
        q: "Can I return or exchange a product?",
        a: "We have a 7-day return policy for unopened products. If you receive a defective device, we'll replace it immediately. Please check our Refund Policy page for complete details.",
    },
    {
        q: "Do you accept trade-ins?",
        a: "Yes! We accept trade-ins for most smartphone brands. Bring in your old device and get up to ৳25,000 off your new purchase. Contact our support team for an instant trade-in quote.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD), bKash, Nagad, bank transfers, and credit/debit cards via SSLCommerz secure payment gateway. EMI options are available on select purchases.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="w-full bg-blue-50/40 py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 md:px-0">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Common Questions</h2>
                    <p className="text-gray-400 text-base mt-2">Everything you need to know</p>
                </div>

                {/* Accordion */}
                <div className="space-y-2">
                    {FAQ_ITEMS.map((item, idx) => (
                        <div
                            key={idx}
                            className={`rounded-xl border transition-all duration-300 ${openIndex === idx
                                ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5'
                                : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <button
                                onClick={() => toggle(idx)}
                                className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left"
                            >
                                <span className={`text-base md:text-lg font-semibold pr-4 transition-colors ${openIndex === idx ? 'text-blue-600' : 'text-gray-900'
                                    }`}>
                                    {item.q}
                                </span>
                                <FiChevronDown
                                    className={`w-5 h-5 shrink-0 transition-all duration-300 ${openIndex === idx ? 'rotate-180 text-blue-600' : 'text-gray-400'
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-5 md:px-6 pb-5 md:pb-6">
                                    <p className="text-base text-gray-500 leading-relaxed">{item.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
