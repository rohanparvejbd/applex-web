"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { getBlogs } from '../../lib/api';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const res = await getBlogs();
                if (res?.success && res.data && res.data.length > 0) {
                    setPosts(res.data);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-[family-name:var(--font-outfit)]">
            {/* Hero */}
            <div className="bg-white py-12 md:py-16">
                <div className="max-w-[1248px] mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight font-[family-name:var(--font-outfit)]">
                        Applex Insights
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto font-[family-name:var(--font-outfit)]">
                        Smartphone reviews, tech guides, and industry news.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-[1248px] mx-auto px-4 md:px-8 py-8">
                <div className="relative max-w-lg mx-auto">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors text-sm font-[family-name:var(--font-outfit)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-[1248px] mx-auto px-4 md:px-8 pb-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-[320px]"></div>
                        ))}
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blogs/${post.id}`}
                                className="group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-300"
                            >
                                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                                    <Image
                                        src={post.image || "/no-image.svg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h2 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
                                        {post.title}
                                    </h2>
                                    <div className="mt-4 flex items-center text-gray-900 font-bold text-sm gap-1.5">
                                        Read Article <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-900">No matching articles found</h3>
                        <p className="text-gray-500 mt-2 text-sm">Try searching with a different keyword.</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 text-sm font-bold text-gray-900 underline hover:no-underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
