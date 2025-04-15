import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`fixed top-0 left-0 flex w-full h-[99px] justify-between items-center bg-[#1E1E1E] transition-all duration-300 ${isScrolled ? 'shadow-lg bg-opacity-100' : 'bg-opacity-75'} px-[22px] z-50`}>
                <Link href="/">
                    <Image src='./images/logo.svg' width={69} height={75} alt="Логотип" />
                </Link>
                <nav className="hidden md:flex gap-[40px] items-center text-white font-body">
                    <Link href="/" className="hover:text-gray-400 transition duration-200">Главная</Link>
                    <Link href="/products" className="hover:text-gray-400 transition duration-200">Продукция</Link>
                    <Link href="/about" className="hover:text-gray-400 transition duration-200">О нас</Link>
                    <Link href="/cart">
                        <Image src='./images/cart.svg' width={59} height={43} alt="Корзина" className="hover:scale-110 transition-transform duration-200" />
                    </Link>
                    <Link href="/register">
                        <Image src='./images/user.svg' width={50} height={45} alt="Аккаунт" className="hover:scale-110 transition-transform duration-200" />
                    </Link>
                </nav>
                <div className="md:hidden flex items-center space-x-4">
                    <button onClick={toggleMenu} aria-label="Меню" className="text-white focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <Link href="/cart" aria-label="Корзина">
                        <Image src='./images/cart.svg' width={35} height={35} alt="Корзина" className="hover:scale-110 transition-transform duration-200" />
                    </Link>
                    <Link href="/register" aria-label="Аккаунт">
                        <Image src='./images/user.svg' width={35} height={35} alt="Аккаунт" className="hover:scale-110 transition-transform duration-200" />
                    </Link>
                </div>
            </div>

            {/* Бургер-меню для мобильной версии */}
            {isMenuOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 transition-opacity duration-300">
                    <div className="absolute top-[99px] left-0 w-full bg-[#1E1E1E] p-4 transition-transform transform translate-y-0 animate-slide-down">
                        <nav className="flex flex-col items-start">
                            <Link href="/" className="text-white py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>Главная</Link>
                            <Link href="/products" className="text-white py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>Продукция</Link>
                            <Link href="/about" className="text-white py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>О нас</Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}