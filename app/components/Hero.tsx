"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';

export default function Hero() {
  const { scrollY } = useScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  // 1. Ensure component is mounted on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Force Play Logic
  useEffect(() => {
    if (mounted && videoRef.current) {
      const playVideo = () => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(err => {
            console.warn("Autoplay blocked, waiting for interaction.");
          });
        }
      };

      playVideo();
      // Secondary trigger in case first one is too fast
      window.addEventListener('load', playVideo);
      return () => window.removeEventListener('load', playVideo);
    }
  }, [mounted]);

  // Scroll Transforms
  const bgOpacity = useTransform(scrollY, [0, 1000], [0, 0.99]);
  const backdropBlur = useTransform(scrollY, [0, 1000], [0, 60]);
  const titleColor = useTransform(scrollY, [0, 1000], ['#fff', '#111827']);
  const linkColor = useTransform(scrollY, [0, 1000], ['rgba(255,255,255,0.8)', '#4b5563']);
  const borderColor = useTransform(scrollY, [0, 1000], ['#fff', '#000']);
  const logoInvert = useTransform(scrollY, [0, 300], [1, 0]);
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const orbOpacity = useTransform(scrollY, [0, 300], [1, 0.9]);

  return (
    <section className="relative bg-black min-h-screen overflow-hidden">
      {/* Background Video - Fixed positioning and attributes */}
      <div className="absolute inset-0 w-full h-full z-0">
        {mounted && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute w-full h-full object-cover"
            poster="/poster.jpg"
          >
            <source src="./background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        style={{ y: y1, opacity: orbOpacity }}
        className="absolute top-20 -left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50"
      >
        <motion.div
          style={{
            opacity: bgOpacity,
            backdropFilter: `blur(${backdropBlur}px)`,
          }}
          className="absolute inset-0 bg-white/80 border-b border-white/20"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
  {/* <motion.div
    whileHover={{ rotate: 5, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="relative w-12 h-12 flex items-center justify-center overflow-hidden"
  >
    <Image
      src="/"
      alt=""
      fill
      className=""
      style={{ 
        
        filter: logoInvert.get() > 0   ? 'invert(1)' : 'none',
        mixBlendMode: logoInvert.get() > 0 ? 'normal' : 'multiply',
      }}
    />
  </motion.div> */}
  <motion.span
    style={{ color: titleColor }}
    className="text-xl font-black tracking-tight"
  >
    INFINITE
  </motion.span>
</Link>

          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Services', 'Features'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors relative group"
              >
                <motion.span style={{ color: linkColor }}>
                  {item}
                </motion.span>
                <motion.span
                  style={{ backgroundColor: borderColor }}
                  className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <motion.span style={{ color: linkColor }} className="text-sm font-medium">
                Log In
              </motion.span>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup">
                <motion.div
                  style={{
                    backgroundColor: useTransform(scrollY, [0, 100], ['#fff', '#000']),
                    color: useTransform(scrollY, [0, 100], ['#000', '#fff']),
                  }}
                  className="px-6 py-2.5 rounded-full text-sm font-medium shadow-md"
                >
                  Sign Up
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column - Text */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.2 } }
            }}
            className="text-left text-white"
          >
            <motion.div
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              NEW: AI PRODUCTIVITY DASHBOARD
            </motion.div>

            <motion.h1
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
            >
              Manage Your{' '}
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm rotate-2 hover:rotate-0 transition-transform">
                <span className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white/50" />
                <span className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white/50" />
                <span className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold border-2 border-white/50">2+</span>
              </span>{' '}
              Team's{' '}
              <span className="relative text-indigo-300 italic font-serif">
                Productivity
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                  <path d="M5 15C50 5 150 5 295 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="opacity-30" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-lg text-white/70 mt-6 max-w-lg"
            >
              Plan projects, stay on track, and deliver on time without overworking your team.
            </motion.p>

            <motion.div
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full font-medium flex items-center gap-2 shadow-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center">
                  <Play size={10} fill="black" />
                </div>
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-medium text-white border border-white/30 hover:bg-white/10 transition-all flex items-center gap-1"
              >
                View Demo <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                <div>
                  <p className="text-white font-bold">Productivity Boost</p>
                  <p className="text-white/60 text-sm">89% faster completion</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-white rounded-full" />
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-white rounded-full" />
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-white rounded-full" />
                </div>
              </div>
              <p className="text-white/50 text-xs mt-6">Real-time analytics</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}