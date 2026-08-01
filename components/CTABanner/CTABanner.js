import { FiBell } from 'react-icons/fi';

export default function CTABanner() {
    return (
        <section className="w-full bg-transparent py-16 md:py-20">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                <div className="rounded-2xl bg-gray-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

                    <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mb-6">
                            <FiBell className="w-6 h-6 text-blue-400" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                            Stay in the loop.
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join 50,000+ subscribers. Get exclusive early access to flash sales, new phone launches, and expert tech reviews.
                        </p>

                        <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-base"
                                required
                            />
                            <button
                                type="submit"
                                className="px-10 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap text-base"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

