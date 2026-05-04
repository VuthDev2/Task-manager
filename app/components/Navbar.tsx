"use client";

import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/features', label: 'Features' },
];

export default function Navbar() {
    const { scrollY } = useScroll();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Scroll transforms for "iOS 26 Hyper-Realistic Liquid Glass"
    const bgOpacity = useTransform(scrollY, [0, 80], [0.03, 0.1]);
    const backdropBlur = useTransform(scrollY, [0, 80], [20, 85]);
    const saturate = useTransform(scrollY, [0, 80], [150, 280]);
    const contrast = useTransform(scrollY, [0, 80], [105, 115]);
    const brightness = useTransform(scrollY, [0, 80], [1.1, 1.18]);
    const titleColor = useTransform(scrollY, [0, 80], ['#fff', '#000']);
    const linkColor = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.9)', '#1f2937']);

    // Derived transforms
    const glassBg = useTransform(bgOpacity, o => `rgba(255, 255, 255, ${o})`);
    const glassFilter = useTransform(
        [backdropBlur, saturate, contrast, brightness],
        ([b, s, c, br]) => `blur(${b}px) saturate(${s}%) contrast(${c}%) brightness(${br})`
    );
    const borderColor = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.25)', 'rgba(0,0,0,0.08)']);

    // For the signup button
    const buttonBg = useTransform(scrollY, [0, 80], ['#fff', '#000']);
    const buttonText = useTransform(scrollY, [0, 80], ['#000', '#fff']);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
            className="fixed top-8 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-50 px-2"
        >
            <motion.div
                style={{
                    backgroundColor: glassBg,
                    backdropFilter: glassFilter,
                    WebkitBackdropFilter: glassFilter,
                }}
                className="absolute inset-0 rounded-[3rem] border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden"
            >
                {/* 1. Base Glass Texture (Noise for physical presence) */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* 2. Specular Refraction (Edge Highlight) */}
                <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/40 pointer-events-none" />

                {/* 3. Thickness Edge (Top Reflection) */}
                <div className="absolute inset-x-0 top-0 h-px bg-white/50 blur-[0.5px] pointer-events-none" />

                {/* 4. Animated "Liquid Shine" (Moves with user presence) */}
                <motion.div
                    animate={{
                        x: ['-100%', '100%'],
                        opacity: [0, 0.3, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                />

                {/* 5. Vivid Glow (Simulates internal light scatter) */}
                <div className="absolute -inset-[50%] bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 blur-[100px] pointer-events-none" />

                {/* 6. Deep Refraction (Fake Thickness Shadow) */}
                <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </motion.div>


            <div className="relative h-16 md:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.span style={{ color: titleColor }} className="text-lg sm:text-xl font-black tracking-tight">INFINITE</motion.span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm font-medium relative group">
                            <motion.span style={{ color: linkColor }}>{item.label}</motion.span>
                            <motion.span style={{ backgroundColor: borderColor }} className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                <div className="hidden sm:flex items-center gap-4">
                    <Link href="/login" className="px-2 py-2">
                        <motion.span style={{ color: linkColor }} className="text-sm font-medium">Log In</motion.span>
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/signup">
                            <motion.div
                                style={{
                                    backgroundColor: buttonBg,
                                    color: buttonText,
                                }}
                                className="px-6 py-2.5 rounded-full text-sm font-medium shadow-md border border-gray-100/10"
                            >
                                Sign Up
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>

                <button
                    type="button"
                    aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((open) => !open)}
                    className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-md"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="sm:hidden absolute left-2 right-2 top-[4.75rem] rounded-[2rem] border border-white/25 bg-black/80 p-3 shadow-2xl backdrop-blur-2xl"
                    >
                        <div className="grid gap-1">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                            <Link onClick={() => setMobileOpen(false)} href="/login" className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white">
                                Log In
                            </Link>
                            <Link onClick={() => setMobileOpen(false)} href="/signup" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black">
                                Sign Up
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
