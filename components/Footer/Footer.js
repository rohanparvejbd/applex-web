"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import { FiTruck, FiShield, FiHeadphones, FiRefreshCcw, FiSend } from 'react-icons/fi';
import { EMERGENCY_PHONE_DISPLAY } from '../../lib/siteContact';

export default function Footer() {
    return (
        <footer className="mt-auto flex flex-col" style={{ background: '#0A0A0B' }}>

            {/* TOP BADGE STRIP */}
            <div style={{ background: '#111113', borderBottom: '1px solid #2D2E33' }}>
                <div className="max-w-[1248px] mx-auto px-4 md:px-0 py-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <FiTruck className="w-5 h-5" />, title: 'Free Delivery', sub: 'Orders over ৳1,000' },
                            { icon: <FiShield className="w-5 h-5" />, title: 'Secure Payment', sub: '100% secure transaction' },
                            { icon: <FiRefreshCcw className="w-5 h-5" />, title: '7 Days Return', sub: 'Easy return policy' },
                            { icon: <FiHeadphones className="w-5 h-5" />, title: '24/7 Support', sub: 'Dedicated assistance' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#26272C', color: '#ffffff' }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>{item.title}</h4>
                                    <p className="text-[12px]" style={{ color: '#A9ADB8' }}>{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN FOOTER CONTENT */}
            <div className="max-w-[1248px] mx-auto px-4 md:px-0 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

                    {/* Col 1: Brand */}
                    <div className="lg:col-span-3 flex flex-col gap-5">
                        <Link href="/">
                            <Image src="/Applex Logo.png" alt="Applex Logo" width={160} height={50} className="h-12 w-auto object-contain brightness-0 invert" unoptimized />
                        </Link>
                        <p className="text-[13px] leading-relaxed" style={{ color: '#A9ADB8' }}>
                            Applex is your ultimate wholesale destination for genuine electronics, gadgets, and accessories at unbeatable prices.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: <FaFacebook size={16} />, href: 'https://web.facebook.com/Applex.bd' },
                                { icon: <FaInstagram size={16} />, href: '#' },
                                { icon: <FaTiktok size={16} />, href: 'https://www.tiktok.com/@applexofficialbd' },
                                { icon: <FaYoutube size={16} />, href: 'https://www.youtube.com/@user-lh5pe6ug2b' },
                            ].map((s, i) => (
                                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                                    style={{ background: '#17181D', color: '#A9ADB8' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = '#1f2025'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#A9ADB8'; e.currentTarget.style.background = '#17181D'; }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Shop */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>Shop</h3>
                        <div className="flex flex-col gap-2.5">
                            {[['All Products', '/products'], ['Categories', '/categories'], ['New Arrivals', '/new-arrivals'], ['Best Sellers', '/best-sellers'], ['Special Offers', '/special-offers']].map(([label, href]) => (
                                <Link key={href} href={href} className="text-[13px] transition-colors" style={{ color: '#A9ADB8' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#A9ADB8'}
                                >{label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 3: Company */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>Company</h3>
                        <div className="flex flex-col gap-2.5">
                            {[['About Us', '/about'], ['Our Blog', '/blogs'], ['Careers', '/careers'], ['Our Partners', '/partners'], ['Contact Us', '/contact']].map(([label, href]) => (
                                <Link key={href} href={href} className="text-[13px] transition-colors" style={{ color: '#A9ADB8' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#A9ADB8'}
                                >{label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 4: Help & Policy */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>Help & Policy</h3>
                        <div className="flex flex-col gap-2.5">
                            {[['Track Order', '/track-order'], ['Warranty Policy', '/warranty'], ['Return & Refund Policy', '/return-policy'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms'], ['FAQs', '/faq']].map(([label, href]) => (
                                <Link key={href} href={href} className="text-[13px] transition-colors" style={{ color: '#A9ADB8' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#A9ADB8'}
                                >{label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 5: Contact + Newsletter */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>Contact Us</h3>
                            {[
                                { icon: <FaMapMarkerAlt size={13} />, text: '4D-0181B, Block D, Level 4, Jamuna Future Park, Dhaka' },
                                { icon: <FaPhoneAlt size={13} />, text: EMERGENCY_PHONE_DISPLAY },
                                { icon: <FaEnvelope size={13} />, text: 'support@applex.com.bd' },
                                { icon: <FaClock size={13} />, text: '11:00 AM – 9:00 PM (Saturday – Thursday)' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="mt-0.5 shrink-0" style={{ color: '#ffffff' }}>{item.icon}</span>
                                    <p className="text-[13px]" style={{ color: '#A9ADB8' }}>{item.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#FFFFFF' }}>Newsletter</h3>
                            <p className="text-[13px]" style={{ color: '#A9ADB8' }}>Subscribe to get updates on new products and exclusive offers.</p>
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Enter your email"
                                    className="flex-1 px-4 py-2.5 rounded-lg outline-none text-[13px]"
                                    style={{ background: '#17181D', border: '1px solid #2A2A2D', color: '#FFFFFF' }}
                                />
                                <button className="px-3 py-2.5 rounded-lg transition-all" style={{ background: '#ffffff', color: '#000000' }}>
                                    <FiSend size={16} />
                                </button>
                            </form>
                            <label className="flex items-center gap-2 text-[12px] cursor-pointer" style={{ color: '#A9ADB8' }}>
                                <input type="checkbox" className="w-3.5 h-3.5" />
                                I agree to the Privacy Policy
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT STRIP */}
            <div style={{ borderTop: '1px solid #2D2E33' }}>
                <div className="max-w-[1248px] mx-auto px-4 md:px-0 py-8 flex flex-col items-center gap-4">
                    <span className="text-[11px] uppercase font-semibold tracking-[0.2em]" style={{ color: '#7C808A' }}>Official Payment Partner</span>
                    <Image src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png" alt="SSLCommerz" width={800} height={60} className="object-contain w-full rounded-lg" unoptimized />
                </div>
            </div>

            {/* BOTTOM COPYRIGHT */}
            <div style={{ borderTop: '1px solid #2D2E33' }}>
                <div className="max-w-[1248px] mx-auto px-4 md:px-0 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-[13px]" style={{ color: '#7C808A' }}>© {new Date().getFullYear()} Applex Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-[13px]" style={{ color: '#7C808A' }}>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                        <span>|</span>
                        <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}

