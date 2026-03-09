"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export default function Navbar() {
    const { scrollY } = useScroll();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll transforms for "Absolute Liquid Glass" effect
    const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.12]);
    const backdropBlur = useTransform(scrollY, [0, 80], [0, 64]);
    const saturate = useTransform(scrollY, [0, 80], [100, 280]);
    const contrast = useTransform(scrollY, [0, 80], [100, 115]);
    const titleColor = useTransform(scrollY, [0, 80], ['#fff', '#000']);
    const linkColor = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.7)', '#374151']);

    // Derived transforms for cleaner JSX
    const glassBg = useTransform(bgOpacity, o => `rgba(255, 255, 255, ${o})`);
    const glassFilter = useTransform([backdropBlur, saturate, contrast], ([b, s, c]) => `blur(${b}px) saturate(${s}%) contrast(${c}%) brightness(1.08)`);
    const borderColor = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)']);

    // For the signup button
    const buttonBg = useTransform(scrollY, [0, 80], ['#fff', '#000']);
    const buttonText = useTransform(scrollY, [0, 80], ['#000', '#fff']);

    if (!mounted) return null;

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
                }}
                className="absolute inset-0 rounded-[3rem] border border-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
            >
                {/* 1. Base Glass Texture (Noise for realism) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* 2. Edge Highlight (Specular Refraction) */}
                <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/60 pointer-events-none" />

                {/* 3. "Liquid" Shine Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />

                {/* 4. Bottom Refraction (Fake Depth) */}
                <div className="absolute inset-x-0 bottom-0 h-[10%] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </motion.div>


            <div className="relative h-16 md:h-20 px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.span style={{ color: titleColor }} className="text-xl font-black tracking-tight">INFINITE</motion.span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium relative group">
                        <motion.span style={{ color: linkColor }}>Home</motion.span>
                        <motion.span style={{ backgroundColor: borderColor }} className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/about" className="text-sm font-medium relative group">
                        <motion.span style={{ color: linkColor }}>About</motion.span>
                        <motion.span style={{ backgroundColor: borderColor }} className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/services" className="text-sm font-medium relative group">
                        <motion.span style={{ color: linkColor }}>Services</motion.span>
                        <motion.span style={{ backgroundColor: borderColor }} className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/features" className="text-sm font-medium relative group">
                        <motion.span style={{ color: linkColor }}>Features</motion.span>
                        <motion.span style={{ backgroundColor: borderColor }} className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
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
            </div>
        </motion.nav>
    );
}
