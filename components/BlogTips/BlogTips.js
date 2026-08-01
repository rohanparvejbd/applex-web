import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';

export default function BlogTips({ posts = [] }) {
    return (
        <section className="w-full bg-transparent py-6 md:py-8">
            <div className="max-w-[1248px] mx-auto px-4 md:px-0">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Blogs & Tips</h2>
                        <p className="text-gray-400 text-sm md:text-base mt-1">Latest updates & articles</p>
                    </div>
                    <Link href="/blogs" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 transition-colors">
                        All Posts <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Blog Grid */}
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blogs/${post.id}`}
                                className="group rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
                            >
                                <div className="aspect-video relative bg-gray-100 overflow-hidden">
                                    <Image
                                        src={post.image || "/no-image.svg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>

                                <div className="p-5 md:p-6 flex flex-col justify-center flex-1">
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors text-center">
                                        {post.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}

