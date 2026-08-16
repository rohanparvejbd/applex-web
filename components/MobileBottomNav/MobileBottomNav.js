"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUser, FiZap, FiLayers, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { cartCount, toggleCart, closeCart } = useCart();
    const { user, openAuthModal } = useAuth();
    const router = useRouter();

    const handleProfileClick = (e) => {
        if (e) e.preventDefault();
        closeCart();
        if (user) {
            router.push('/profile');
        } else {
            openAuthModal('login');
        }
    };

    const navItems = [
        { icon: FiHome, label: 'Home', path: '/', onClick: closeCart },
        { icon: FiLayers, label: 'Categories', path: '/categories', onClick: closeCart },
        { icon: FiShoppingBag, label: 'Cart', path: null, badge: cartCount, onClick: toggleCart },
        { icon: FiZap, label: 'Flash Sale', path: '/flash-sale', onClick: closeCart },
        { icon: FiUser, label: 'Profile', path: null, onClick: handleProfileClick },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
            <div className="w-full bg-white border-t border-gray-200 pointer-events-auto shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                <div className="flex justify-around items-center h-[60px] px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path
                            ? pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
                            : false;

                        const inner = (
                            <div className="flex flex-col items-center justify-center gap-0.5 relative">
                                <div className="relative">
                                    <Icon
                                        className={`w-[22px] h-[22px] transition-all duration-200 ${
                                            isActive ? 'text-black' : 'text-gray-400'
                                        }`}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                    />
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-[15px] min-w-[15px] px-0.5 rounded-full flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-semibold transition-all duration-200 ${
                                    isActive ? 'text-black' : 'text-gray-400'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                        );

                        if (item.path) {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.path}
                                    onClick={item.onClick}
                                    className="flex items-center justify-center w-16 h-full"
                                    aria-label={item.label}
                                >
                                    {inner}
                                </Link>
                            );
                        }
                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={item.onClick}
                                className="flex items-center justify-center w-16 h-full"
                                aria-label={item.label}
                            >
                                {inner}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
