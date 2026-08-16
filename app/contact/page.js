export const metadata = {
    title: 'Contact Us | Applex',
    description: 'Get in touch with Applex. We are here to help you with your tech needs.',
};

import { MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen font-[family-name:var(--font-outfit)]">
            {/* Hero */}
            <div className="bg-white py-10 md:py-12">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 font-[family-name:var(--font-outfit)]">Contact Us</h1>
                    <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-outfit)]">
                        Have a question or need help? Reach out to us and we'll get back to you as soon as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-gray-900 mb-4">Get In Touch</h2>
                        {[
                            { label: 'Address', value: 'Shop: 4D-018B1, Block D, Level 4, Jamuna Future Park, Dhaka, Bangladesh, 1229', icon: <MapPin className="w-5 h-5" /> },
                            { label: 'Phone', value: '09611-901399', icon: <Phone className="w-5 h-5" /> },
                            { label: 'Working Hours', value: 'Sat - Thu: 10AM - 8PM', icon: <Clock className="w-5 h-5" /> },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                                    <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-5">Send Us a Message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                <input type="text" placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors font-[family-name:var(--font-outfit)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                                <input type="email" placeholder="your@email.com" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors font-[family-name:var(--font-outfit)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone</label>
                                <input type="tel" placeholder="+880 XXXX XXXXXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors font-[family-name:var(--font-outfit)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Message</label>
                                <textarea rows={4} placeholder="How can we help you?" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none font-[family-name:var(--font-outfit)]" />
                            </div>
                            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
